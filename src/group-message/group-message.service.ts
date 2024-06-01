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
import { GroupChatUser } from 'src/group-chat/entities/group-chat-user.entity';

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

    const r = (await this.groupMessageRepository
      .createQueryBuilder('group-message')
      .select('count(*) as msgNumber')
      .addSelect('gcu.userId', 'userId')
      .leftJoin(GroupChatUser, 'gcu', 'group-message.groupId = gcu.groupChatId')
      .where('gcu.exitTime IS NULL AND gcu.enterTime IS NULL')
      .orWhere(
        '(group-message.createdTime > gcu.exitTime AND group-message.fromUserId <> gcu.userId)',
      )
      .groupBy('gcu.userId')
      .getRawMany()) as { userId: number; msgNumber: number }[];

    // 正在群中聊天用户
    const allRedisList = await this.redisService.getAllActiveUser();
    const allRedisListParse = allRedisList.map((item: string) =>
      JSON.parse(item),
    ) as { msgType: MessageEnum; userId: number; toUserId: number }[];
    let usersId: number[] = [];

    if (
      allRedisListParse.filter(
        (item) => item.toUserId === createGroupMessageDto.groupId,
      ).length > 1
    ) {
      usersId = allRedisListParse.map((item) => item.userId);
    }

    r.forEach((item) => {
      if (usersId.some((i) => i === item.userId)) {
        item.msgNumber = 0;
      }
    });

    await this.groupChatUserService.updateUsersStatusComplex(
      createGroupMessageDto.groupId,
      r,
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

    // 读取缓存
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

  async updateGroupUserMsgNumber(
    groupChatId: number,
    msgNumber: number,
    userId?: number,
  ) {
    this.groupChatUserService.updateSingleMsgNumber(
      groupChatId,
      msgNumber,
      userId,
    );
  }

  // 更新撤回，删除
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
