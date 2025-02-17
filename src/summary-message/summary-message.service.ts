import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShip } from 'src/friend-ship/entities/friend-ship.entity';
import { FriendShipService } from 'src/friend-ship/friend-ship.service';
import { GroupChatUserService } from 'src/group-chat/group-chat-user.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SummaryMessageService {
  constructor(
    @InjectRepository(FriendShip)
    private friendShipRepository: Repository<FriendShip>,

    private readonly userService: UserService,
    private readonly friendShipService: FriendShipService,
    private readonly groupChatUserService: GroupChatUserService,
  ) {}
  async selectUserInfo(userId: number) {
    const userInform = await this.userService.findOne(userId);

    // 统计当前用户男女有多少个
    const manWomamNumber = await this.friendShipRepository.query(`
      SELECT
        COUNT(*) as number,
        user.gender,
        CASE
            WHEN gender = 1 THEN
          '男' ELSE '女'
        END as gender
      FROM
        friend_ship
        LEFT JOIN user on  friend_ship.userId = user.id
      WHERE
        friendId = ${userId}
        GROUP BY user.gender;
      `);

    // 统计当前用户好友数量
    const peopleNumber = await this.friendShipService.findAllFriendByUserId(userId);

    // 统计当前用户所在的群聊数量
    const groupChatNumber = await this.groupChatUserService.findUserGroupChatNumber(userId);

    return {
      userInform,
      userFriendInformation: {
        peopleNumber,
        groupChatNumber,
        manWomamNumber,
      },
    };
  }
}
