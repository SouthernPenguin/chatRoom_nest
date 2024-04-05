import { Injectable } from '@nestjs/common';
import { GroupChatUser } from './entities/group-chat-user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupChatUserService {
  constructor(
    @InjectRepository(GroupChatUser)
    private groupChatUserRepository: Repository<GroupChatUser>,
  ) {}

  // 详情
  async findOne(groupChatId: number) {
    return this.groupChatUserRepository
      .createQueryBuilder('group_chat_user')
      .where({ groupChatId })
      .getMany();
  }

  // 更新信息数量
  async updateMsgNumber(
    groupChatId: number,
    msgNumber: number,
    userId?: number,
  ) {
    await this.groupChatUserRepository
      .createQueryBuilder()
      .update(GroupChatUser)
      .set({
        msgNumber,
      })
      .where('groupChatId = :id', { id: groupChatId })
      // .andWhere
      .execute();
  }

  // 查询用户是否在群里
  selectUser(userId: number) {
    return this.groupChatUserRepository.findOne({
      where: { userId },
    });
  }
}
