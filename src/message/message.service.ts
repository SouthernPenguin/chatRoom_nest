import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { ListMessageDto } from './dto/list-message.dto';
import { ChatType, MessageEnum } from 'src/enum';
import { NotificationService } from 'src/notification/notification.service';
import { FriendShipService } from 'src/friend-ship/friend-ship.service';
import { ChangeMessageState } from './dto/change-message-state';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private notificationService: NotificationService,
    private friendShipService: FriendShipService,
    private redisService: RedisService,
  ) {}

  async create(createMessageDto: CreateMessageDto, currentUser?: number) {
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
    await this.countUnReadNumber(createMessageDto, currentUser);

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

  // 聊天记录列表;
  async findAll(listMessageDto: ListMessageDto, currentUser?: number) {
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

    const allRedisList = await this.redisService.getAllActiveUser();
    const allRedisListParse = allRedisList.map((item: string) =>
      JSON.parse(item),
    );
    if (currentUser) {
      if (
        allRedisListParse.filter((item) => item.userId === currentUser).length <
        1
      ) {
        // 双方用户正在聊天 设置缓存
        this.redisService.setList({
          msgType: ChatType.私聊,
          userId: currentUser,
          toUserId:
            listMessageDto.fromUserId === currentUser
              ? listMessageDto.toUserId
              : listMessageDto.fromUserId,
        });
      } else {
        this.redisService.deleteActiveUserItem(
          JSON.stringify(
            allRedisListParse.filter((item) => item.userId === currentUser)[0],
          ),
        );
        this.redisService.setList({
          msgType: ChatType.私聊,
          userId: currentUser,
          toUserId:
            listMessageDto.fromUserId === currentUser
              ? listMessageDto.toUserId
              : listMessageDto.fromUserId,
        });
      }
    }

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
        await this.countUnReadNumber(changeMessageState, currentUser);
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
  async countUnReadNumber(
    createMessageDto: ChangeMessageState,
    currentUser: number,
  ) {
    try {
      let countUnReadNumberQuery = await this.messageRepository
        .createQueryBuilder('message')
        .select('message.fromUserId as userId, COUNT(*) AS msgNumber')
        .where(
          `
          ((message.fromUserId = :fromUserId and message.toUserId = :toUserId ) or (message.fromUserId = :toUserId and message.toUserId = :fromUserId )) 
          and 
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

      // 赋值未读信息
      if (countUnReadNumberQuery.length && countUnReadNumberQuery.length < 2) {
        countUnReadNumberQuery.push({
          userId:
            countUnReadNumberQuery[0].userId === createMessageDto.toUserId
              ? createMessageDto.fromUserId
              : createMessageDto.toUserId,
          msgNumber: 0,
        });
      } else {
        countUnReadNumberQuery = [
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

      // 获取所有缓存
      const redisList = (await this.redisService.getAllActiveUser()).map(
        (item) => JSON.parse(item),
      ) as {
        msgType: ChatType;
        userId: number;
        toUserId: number;
      }[];

      // 过滤出当前发送用户的缓存
      const filterList = redisList.filter(
        (item) => item.userId === currentUser,
      );

      // 通过当前用户缓存，再去找对方是否和自己正在聊天
      const areBothPartiesChatting = redisList.filter(
        (item) => item.toUserId === filterList[0].userId,
      );

      if (areBothPartiesChatting.length) {
        countUnReadNumberQuery.forEach((item) => {
          item.msgNumber = 0;
        });
      }

      await this.friendShipService.upUserMsgNumber(countUnReadNumberQuery);
    } catch (error) {
      console.log(error);
    }
  }
}
