import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { ListMessageDto } from './dto/list-message.dto';
import { MessageEnum } from 'src/enum';
import { NotificationService } from 'src/notification/notification.service';
import { FriendShipService } from 'src/friend-ship/friend-ship.service';
import { ChangeMessageState } from './dto/change-message-state';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private notificationService: NotificationService,
    private friendShipService: FriendShipService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const isFriend = await this.friendShipService.isFriend(
      createMessageDto.toUserId,
      createMessageDto.fromUserId,
    );
    if (!isFriend?.id) {
      throw new BadRequestException('不是好友关系无法发送消息');
    }

    const resCreate = await this.messageRepository.create(createMessageDto);
    const res = await this.messageRepository.save(resCreate);

    // 统计未读信息
    await this.countUnReadNumber(createMessageDto);

    // 发送通知
    if (res?.id) {
      await this.notificationService.create({
        newMessage: res.fileSize
          ? res.postMessage.split('files/')[1]
          : res.postMessage,
        fromUserId: res.fromUserId,
        toUserId: res.toUserId,
        msgType: createMessageDto.msgType,
      });
      return res;
    }
  }

  // 当前用户消息列表;
  async getNewNotice(id: number) {
    return await this.notificationService.findOne(id);
  }

  async findAll(listMessageDto: ListMessageDto) {
    const { page, limit } = listMessageDto;
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.state  <> :state', { state: MessageEnum.撤回 });

    if (listMessageDto.createdTime && listMessageDto.createdTime.length) {
      queryBuilder.andWhere(
        'DATE_FORMAT(message.createdTime, "%Y-%m-%d") BETWEEN :startDate AND :endDate',
        {
          startDate: listMessageDto.createdTime[0],
          endDate: listMessageDto.createdTime[1],
        },
      );
    }

    queryBuilder
      .andWhere(
        '((message.fromUserId = :fromUserId and message.toUserId= :toUserId) or (message.toUserId= :fromUserId and message.fromUserId = :toUserId))',
        {
          fromUserId: listMessageDto.fromUserId,
          toUserId: listMessageDto.toUserId,
        },
      )
      .addOrderBy('message.createdTime', 'DESC')
      .leftJoinAndSelect('message.toUser', 'toUser') // 关联的实体属性，别名
      .leftJoinAndSelect('message.fromUser', 'fromUser');

    const count = await queryBuilder.getCount();
    const content = await queryBuilder
      .skip((page - 1) * limit || 0)
      .take(limit || 10)
      .getMany();

    return {
      content,
      totalElements: count,
      totalPages: Number(page || 1),
    } as unknown;
  }

  // 更新所有未读状态
  async upAllState(
    changeMessageState: ChangeMessageState,
    currentUser: number,
  ) {
    try {
      const fromUserId =
        currentUser == changeMessageState.fromUserId
          ? changeMessageState.toUserId
          : changeMessageState.fromUserId;

      const toUserId =
        currentUser == changeMessageState.fromUserId
          ? changeMessageState.fromUserId
          : changeMessageState.toUserId;

      const withdraw = await this.messageRepository
        .createQueryBuilder('message')
        .update(Message)
        .set({ state: MessageEnum.已读 })
        .where(
          'message.fromUserId = :fromUserId and message.toUserId = :toUserId ',
          { toUserId, fromUserId },
        )
        .execute();

      if (withdraw.affected > 0) {
        await this.countUnReadNumber(changeMessageState);
      }
    } catch (error) {
      console.log(error, 'sssssss');
    }
  }

  async changeMessageState(id: number, state: MessageEnum) {
    const res = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    // 撤销
    if (res?.id && state === MessageEnum.撤回) {
      const createdTime = new Date(res.createdTime).getTime();
      const nowTime = new Date().getTime();
      const resultTime = nowTime - createdTime;
      if (new Date(resultTime).getMinutes() > 3) {
        throw new BadRequestException('时间超过了3分钟无法撤回'); // return '';
      }

      const withdraw = await this.messageRepository
        .createQueryBuilder('message')
        .update(Message)
        .set({ state })
        .where('id = :id', { id })
        .execute();
      if (withdraw.affected > 0) {
        return '已撤回';
      }
    }

    // 删除
    if (res?.id && state === MessageEnum.删除) {
      const withdraw = await this.messageRepository
        .createQueryBuilder('message')
        .update(Message)
        .set({ state })
        .where('id = :id', { id })
        .execute();
      if (withdraw.affected > 0) {
        return '已删除';
      }
    }
  }

  // 统计双方未读次数
  async countUnReadNumber(createMessageDto: ChangeMessageState) {
    let countUnReadNumber = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.fromUserId as userId, COUNT(*) AS msgNumber')
      .where(
        `((message.fromUserId = :fromUserId and message.toUserId = :toUserId ) or (message.fromUserId = :toUserId and message.toUserId = :fromUserId )) and 
        message.state = :state
        `,
        {
          fromUserId: createMessageDto.fromUserId,
          toUserId: createMessageDto.toUserId,
          state: MessageEnum.未读,
        },
      )
      .groupBy('userId')
      .getRawMany();

    if (countUnReadNumber.length && countUnReadNumber.length < 2) {
      countUnReadNumber.push({
        userId:
          countUnReadNumber[0].userId === createMessageDto.toUserId
            ? createMessageDto.fromUserId
            : createMessageDto.toUserId,
        msgNumber: 0,
      });
    } else {
      countUnReadNumber = [
        {
          userId: createMessageDto.toUserId,
          msgNumber: 0,
        },
        {
          userId: createMessageDto.fromUserId,
          msgNumber: 0,
        },
      ];
    }

    // 双方正在聊天更新条数：
    /**
       A用户  vs B用户
      redis
      [
        {
            1.A点击B用户

          // A用户
          userId:当前用户A,
          toUserId:当前聊天用户B
        },
        {
          1.B点击A用户
          // B用户
          userId:当前用户B,
          toUserId:当前聊天用户A
        }
      ]
      A用户发送给B，缓存里取A，通过toUserId去获取B用户，在通过B户用的toUserId是否是我，判断是否更新未读信息
    */

    await this.friendShipService.upUserMsgNumber(countUnReadNumber);
  }
}
