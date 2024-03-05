import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { GroupMessage } from './entities/group-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEnum } from 'src/enum';
import { ListGroupMessageDto } from './dto/list-group-message.dto';
import { GroupChatUserService } from 'src/group-chat/group-chat-user.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class GroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private groupMessageRepository: Repository<GroupMessage>,
    private groupChatService: GroupChatUserService,
    private notificationService: NotificationService,
  ) {}

  async create(createGroupMessageDto: CreateGroupMessageDto) {
    const isUser = await this.groupChatService.selectUser(
      createGroupMessageDto.fromUserId,
    );
    if (!isUser) {
      throw new BadRequestException('此用户不在群里中');
    }
    const res = await this.groupMessageRepository.create(createGroupMessageDto);
    const returnRes = await this.groupMessageRepository.save(res);

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

  async findAll(id: number | string, listGroupMessage: ListGroupMessageDto) {
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
      .orderBy('group-message.createdTime', 'ASC')
      .leftJoinAndSelect('group-message.fromUser', 'fromUserId');

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

  async update(userId: number, id: number, state: MessageEnum) {
    const groupUserId = await this.groupChatService.selectUser(userId);

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

  // 当前用户消息列表;
  async getNewNotice(id: number) {
    return await this.notificationService.findOne(id);
  }
}
