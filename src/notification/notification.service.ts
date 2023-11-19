import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateDto } from './dto/create-notification.dto';
import { MessageEnum } from 'src/enum';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notice)
    private notificationService: Repository<Notice>,
  ) {}

  // 创建聊天列表
  async create(createDto: CreateDto) {
    try {
      const res = await this.bothNotice(
        createDto.fromUserId,
        createDto.toUserId,
      );
      if (res?.id) {
        this.update(res.id, createDto);
      } else {
        const res = await this.notificationService.create(createDto);
        await this.notificationService.save(res);
      }
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }

  // 当前用户消息列表
  async findOne(id: number) {
    try {
      const res = await this.notificationService
        .createQueryBuilder('notice')
        .where(
          '(notice.fromUserId = :id or notice.toUserId = :id) and state != :state',
          {
            id,
            state: 'DELETE',
          },
        )
        .addOrderBy('updateTime', 'DESC')
        .leftJoinAndSelect('notice.toUser', 'toUser')
        .leftJoinAndSelect('notice.fromUser', 'fromUser')
        .getMany();
      return res;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  // 更新最新信息
  async update(id: number, createDto: CreateDto) {
    this.notificationService
      .createQueryBuilder('notice')
      .update()
      .set({
        newMessage: createDto.newMessage,
      })
      .where('id = :id ', { id })
      .execute();
  }

  // 更新状态
  async upDateState(id: number, state: MessageEnum) {
    const res = await this.notificationService
      .createQueryBuilder('notice')
      .update()
      .set({
        state,
      })
      .where('id = :id ', { id })
      .execute();
    if (res.affected >= 1) {
      return '更新成功';
    }
  }

  remove(id: number) {
    return `This action removes a #${id} `;
  }

  // 查找双方最新记录
  async bothNotice(userId: number, friendId: number) {
    const slqStr =
      '(notice.toUserId = :userId and notice.fromUserId = :friendId) or (notice.toUserId = :friendId and notice.fromUserId = :userId)';
    const res = await this.notificationService
      .createQueryBuilder('notice')
      .where(slqStr, {
        userId,
        friendId,
      })
      .getOne();
    return res;
  }
}
