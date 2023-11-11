import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { Repository } from 'typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEnum } from 'src/enum';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private charRoomRepository: Repository<Chatroom>,
  ) {}

  // 创建聊天列表
  async create(createChatroomDto: CreateChatroomDto) {
    try {
      const res = await this.isFriend(
        createChatroomDto.fromUserId,
        createChatroomDto.toUserId,
      );
      if (res?.id) {
        this.update(res.id, createChatroomDto);
      } else {
        const res = await this.charRoomRepository.create(createChatroomDto);
        this.charRoomRepository.save(res);
      }
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.charRoomRepository
        .createQueryBuilder('chatroom')
        .where(
          '(chatroom.fromUserId = :id or chatroom.toUserId = :id) and state != :state',
          {
            id,
            state: 'DELETE',
          },
        )
        .addOrderBy('updateTime', 'DESC')
        .leftJoinAndSelect('chatroom.toUser', 'toUser')
        .leftJoinAndSelect('chatroom.fromUser', 'fromUser')
        .getMany();
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  // 更新最新信息
  async update(id: number, createChatroomDto: CreateChatroomDto) {
    this.charRoomRepository
      .createQueryBuilder('chatroom')
      .update(Chatroom)
      .set({
        newMessage: createChatroomDto.newMessage,
      })
      .where('id = :id ', { id })
      .execute();
  }

  // 更新状态
  async upDateState(id: number, state: MessageEnum) {
    const res = await this.charRoomRepository
      .createQueryBuilder('chatroom')
      .update(Chatroom)
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
    return `This action removes a #${id} chatroom`;
  }

  // 查找双方最新记录
  async isFriend(userId: number, friendId: number) {
    return this.charRoomRepository
      .createQueryBuilder('chatroom')
      .where(
        `
        (chatroom.toUserId = :userId and chatroom.fromUserId = :friendId) 
        or 
        (chatroom.fromUserId = :friendId and chatroom.toUserId = :userId)`,
        {
          userId,
          friendId,
        },
      )
      .getOne();
  }
}
