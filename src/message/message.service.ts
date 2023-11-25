import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { ListMessageDto } from './dto/list-message.dto';
import { MessageEnum } from 'src/enum';
import { NotificationService } from 'src/notification/notification.service';
import { FriendShipService } from 'src/friend-ship/friend-ship.service';

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
      throw new UnauthorizedException('不是好友关系无法发送消息');
    }

    const resCreate = await this.messageRepository.create(createMessageDto);

    const res = await this.messageRepository.save(resCreate);
    if (res?.id) {
      await this.notificationService.create({
        newMessage: res.postMessage,
        fromUserId: res.fromUserId,
        toUserId: res.toUserId,
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
      .where('message.state != :state', { state: MessageEnum.撤回 })
      .andWhere("message.postMessage  <> null or message.postMessage <> '' ");

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
      .andWhere({
        fromUserId: listMessageDto.fromUserId,
        toUserId: listMessageDto.toUserId,
      })
      .orWhere({
        toUserId: listMessageDto.fromUserId,
        fromUserId: listMessageDto.toUserId,
      })
      .orderBy('message.createdTime', 'ASC')
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
        return '时间超过了3分钟无法撤回';
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
}
