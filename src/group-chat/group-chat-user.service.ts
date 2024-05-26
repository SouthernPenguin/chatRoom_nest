import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GroupChatUser } from './entities/group-chat-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterExitTime } from './dto/enter-exit-time.dto';
import { GroupChat } from './entities/group-chat.entity';

@Injectable()
export class GroupChatUserService {
  constructor(
    @InjectRepository(GroupChatUser)
    private groupChatUserRepository: Repository<GroupChatUser>,

    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,
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
      .andWhere('userId <> :userId', {
        userId: userId,
      })
      .execute();
  }

  // 查询用户是否在群里
  selectUser(userId: number) {
    return this.groupChatUserRepository.findOne({
      where: { userId },
    });
  }

  // 记录进入离开时间
  async updateEnterTimeExitTime(userId: number, enterExitTime: EnterExitTime) {
    try {
      const res = await this.groupChatUserRepository
        .createQueryBuilder('group_chat_user')
        .where({ groupChatId: enterExitTime.groupId, userId })
        .getOne();

      if (enterExitTime.enterTime) {
        res.enterTime = enterExitTime.enterTime;
        this.groupChatUserRepository.save(res);
      }

      if (enterExitTime.exitTime) {
        res.exitTime = enterExitTime.exitTime;
        this.groupChatUserRepository.save(res);
      }
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }
}
