import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { ListMessageDto } from './dto/list-message.dto';
import { MessageEnum } from 'src/enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const resCreate = await this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(resCreate);
  }

  async findAll(listMessageDto: ListMessageDto) {
    const { page, limit } = listMessageDto;
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.state != :state', { state: MessageEnum.撤回 });

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
