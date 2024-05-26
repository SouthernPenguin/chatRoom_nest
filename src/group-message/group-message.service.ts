import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GroupMessage } from './entities/group-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatType, MessageEnum } from 'src/enum';
import { ListGroupMessageDto } from './dto/list-group-message.dto';
import { GroupChatUserService } from 'src/group-chat/group-chat-user.service';
import { NotificationService } from 'src/notification/notification.service';
import { RedisService } from 'src/redis/redis.service';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { EnterExitTime } from 'src/group-chat/dto/enter-exit-time.dto';

@Injectable()
export class GroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private groupMessageRepository: Repository<GroupMessage>,
    private groupChatService: GroupChatService,
    private notificationService: NotificationService,
    private groupChatUserService: GroupChatUserService,
    private redisService: RedisService,
  ) {}

  async create(createGroupMessageDto: CreateGroupMessageDto) {
    const isUser = await this.groupChatUserService.selectUser(
      createGroupMessageDto.fromUserId,
    );
    if (!isUser) {
      throw new BadRequestException('此用户不在群里中');
    }
    const res = await this.groupMessageRepository.create(createGroupMessageDto);
    const returnRes = await this.groupMessageRepository.save(res);

    const r = await this.groupMessageRepository
      .createQueryBuilder('group-message')
      .select('count(*) as msgNumber')
      .where('groupId = :groupId', { groupId: createGroupMessageDto.groupId })
      // .andWhere('group-message.state = :state', { state: MessageEnum.未读 })
      // .andWhere('fromUserId <> :fromUserId', {
      //   fromUserId: createGroupMessageDto.fromUserId,
      // })
      .getRawOne();

    await this.groupChatUserService.updateMsgNumber(
      createGroupMessageDto.groupId,
      r.msgNumber,
      createGroupMessageDto.fromUserId,
    );

    if (returnRes?.id) {
      await this.notificationService.create({
        newMessage: res.fileSize
          ? res.postMessage.split('files/')[1]
          : res.postMessage,
        fromUserId: res.fromUserId,
        toUserId: null,
        groupId: createGroupMessageDto.groupId,
        msgType: createGroupMessageDto.msgType,
      });
    }
    return returnRes;
  }

  async findAll(
    id: number | string,
    listGroupMessage: ListGroupMessageDto,
    currentUser?: number,
  ) {
    const { page, limit } = listGroupMessage;
    const queryBuilder = this.groupMessageRepository
      .createQueryBuilder('group-message')
      .where('group-message.state  <> :state', { state: MessageEnum.撤回 });

    if (listGroupMessage.createdTime && listGroupMessage.createdTime.length) {
      queryBuilder.andWhere(
        'DATE_FORMAT(group-message.createdTime, "%Y-%m-%d") BETWEEN :startDate AND :endDate',
        {
          startDate: listGroupMessage.createdTime[0],
          endDate: listGroupMessage.createdTime[1],
        },
      );
    }

    queryBuilder
      .andWhere('group-message.groupId = :id', { id })
      .leftJoinAndSelect('group-message.fromUser', 'fromUserId');

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
          msgType: ChatType.群聊,
          userId: currentUser,
          toUserId: Number(id),
        });
      } else {
        this.redisService.deleteActiveUserItem(
          JSON.stringify(
            allRedisListParse.filter((item) => item.userId === currentUser)[0],
          ),
        );
        this.redisService.setList({
          msgType: ChatType.群聊,
          userId: currentUser,
          toUserId: Number(id),
        });
      }
    }

    const count = await queryBuilder.getCount();
    const content = await queryBuilder
      .orderBy('group-message.createdTime', 'DESC')
      .skip((page - 1) * limit || 0)
      .take(limit || 10)
      .getMany();

    return {
      content,
      totalElements: count,
      totalPages: Number(page || 1),
    } as unknown;
  }

  async update(userId: number, id: number, state: MessageEnum) {
    const groupUserId = await this.groupChatUserService.selectUser(userId);

    if (!groupUserId.userId) {
      throw new BadRequestException('此用户不在群里中');
    }

    const res = await this.groupMessageRepository.findOne({
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

      const withdraw = await this.groupMessageRepository
        .createQueryBuilder('group-message')
        .update(GroupMessage)
        .set({ state })
        .where('id = :id', { id })
        .execute();
      if (withdraw.affected > 0) {
        return '已撤回';
      }
    }

    // 删除
    if (res?.id && state === MessageEnum.删除) {
      const withdraw = await this.groupMessageRepository
        .createQueryBuilder('group-message')
        .update(GroupMessage)
        .set({ state })
        .where('id = :id', { id })
        .execute();
      if (withdraw.affected > 0) {
        return '已删除';
      }
    }
  }

  async upDateEnterExitTime(userId: number, enterExitTime: EnterExitTime) {
    return await this.groupChatUserService.updateEnterTimeExitTime(
      userId,
      enterExitTime,
    );
  }

  // 当前用户消息列表;
  async getNewNotice(id: number) {
    return await this.notificationService.findOne(id);
  }
}
