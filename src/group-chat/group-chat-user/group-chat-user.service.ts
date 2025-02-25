import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GroupChatUser } from '../entities/group-chat-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterExitTime } from '../dto/enter-exit-time.dto';
import { GroupChat } from '../entities/group-chat.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class GroupChatUserService {
  constructor(
    @InjectRepository(GroupChatUser)
    private groupChatUserRepository: Repository<GroupChatUser>,

    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,

    private userService: UserService,
  ) {}

  // 详情
  async findOne(groupChatId: number) {
    const userIds = (await this.groupChatUserRepository.find({ where: { groupChatId: groupChatId } })).map(
      item => item.userId,
    );
    return {
      content: await this.userService.batchUser(userIds),
    };
  }

  // 用户群列表
  async userGroupList(userId: number) {
    return await this.groupChatRepository.query(
      `SELECT
        group_chat.*
        FROM
          group_chat_user
          INNER  JOIN group_chat ON group_chat_user.groupChatId = group_chat.id
          AND group_chat_user.userId = ${userId}
        GROUP BY
          group_chat.id`,
    );
  }

  // 更新信息数量
  async updateMsgNumber(groupChatId: number, msgNumber: number, userId?: number[]) {
    await this.groupChatUserRepository
      .createQueryBuilder()
      .update(GroupChatUser)
      .set({
        msgNumber,
      })
      .where('groupChatId = :id', { id: groupChatId })
      .andWhere('userId NOT In(:userId)', {
        userId: userId,
      })
      .execute();
  }

  // 批量跟新
  async updateUsersStatusComplex(groupChatId: number, updateData: { msgNumber: number; userId: number }[]) {
    for await (const item of updateData) {
      this.groupChatRepository
        .createQueryBuilder()
        .update(GroupChatUser)
        .set({ msgNumber: item.msgNumber })
        .where('groupChatId = :id', { id: groupChatId })
        .andWhere('userId = :userId', {
          userId: item.userId,
        })
        .execute();
    }
  }

  updateSingleMsgNumber(groupChatId: number, msgNumber: number, userId?: number) {
    this.groupChatUserRepository
      .createQueryBuilder()
      .update(GroupChatUser)
      .set({
        msgNumber,
      })
      .where('groupChatId = :id', { id: groupChatId })
      .andWhere('userId = :userId', {
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

  // 当前用户加入的群数量
  async findUserGroupChatNumber(userId: number) {
    const res = await this.groupChatUserRepository.query(
      `  SELECT COUNT(group_chat_user.groupChatId) as number FROM group_chat_user WHERE userId = ${userId}  GROUP BY group_chat_user.groupChatId`,
    );
    return res.length;
  }
}
