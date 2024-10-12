import { Injectable, BadRequestException } from '@nestjs/common';
import { UserAuthService } from 'src/user/userAuth.service';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShip } from './entities/friend-ship.entity';
import { Repository } from 'typeorm';
import { ChatType, FriendShipEnum } from 'src/enum';
import { UserService } from 'src/user/user.service';
import { Notice } from 'src/notification/entities/notice.entity';
import { GroupChatUserService } from 'src/group-chat/group-chat-user.service';
import { GroupChatUser } from 'src/group-chat/entities/group-chat-user.entity';

@Injectable()
export class FriendShipService {
  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    @InjectRepository(FriendShip)
    private friendShipRepository: Repository<FriendShip>,
    private groupChatUserService: GroupChatUserService,
  ) {}

  async selectUser(id: number, name: string) {
    return await this.userService.selectUser(id, name);
  }

  async selectAwaitFriend(toUserId: number) {
    const res = await this.friendShipRepository.find({
      where: {
        toUserId,
        // state: FriendShipEnum.发起,
      },
    });
    return {
      content: res,
    };
  }

  async addUser(id: number, createFriendShipDto: CreateFriendShipDto) {
    const allUsers = await this.userAuthService.selectAllUser([
      createFriendShipDto.friendId,
      createFriendShipDto.userId,
    ]);

    if (allUsers.length < 2) {
      throw new BadRequestException('用户不存在');
    }

    const friend = await this.isFriend(createFriendShipDto.userId, createFriendShipDto.friendId);

    if (id === createFriendShipDto.fromUserId && friend && friend?.id) {
      throw new BadRequestException('已发起好友请求，请等待对方通过');
    }

    if (friend && friend?.id && friend.state == FriendShipEnum.通过) {
      throw new BadRequestException('已经是好友关系');
    }

    // 创建好友
    const res = await this.friendShipRepository.create({
      ...createFriendShipDto,
      notes: createFriendShipDto.notes,
    });
    return this.friendShipRepository.save(res);
  }

  // 更新状态;
  async upUserState(id: number, type: FriendShipEnum) {
    const res = await this.friendShipRepository.findOne({
      where: {
        id,
      },
    });
    res.state = type;
    return this.friendShipRepository.save(res);
  }

  /**
   * 更新未读数量;
   * @param msgNumber 双方未读信息数量
   * @param activeChatUser 当前正在聊天用户
   */

  async upUserMsgNumber(msgNumber: { userId: number; msgNumber: number | string }[]) {
    if (!msgNumber.length) {
      throw new BadRequestException('');
    }

    //查询好友关系
    const res = await this.friendShipRepository
      .createQueryBuilder('friend-ship')
      .where('friend-ship.sortedKey = :sortedKey1 or friend-ship.sortedKey = :sortedKey2', {
        sortedKey1: `${msgNumber[0].userId}-${msgNumber[1].userId}`,
        sortedKey2: `${msgNumber[1].userId}-${msgNumber[0].userId}`,
      })
      .getOne();

    if (res) {
      const userRes = msgNumber.filter(i => i.userId === res.userId);
      if (userRes.length) {
        res.userMsgNumber = Number(userRes[0].msgNumber);
      }

      const friendRes = msgNumber.filter(i => i.userId === res.friendId);
      if (friendRes.length) {
        res.friendMsgNumber = Number(friendRes[0].msgNumber);
      }
      this.friendShipRepository.save(res);
    } else {
      throw new BadRequestException('');
    }
  }

  async selectUnreadNumber(notices: Notice[], currentUserId: number) {
    if (notices.length) {
      for await (const item of notices) {
        if (item.msgType === ChatType.私聊) {
          const msgNumber = await this.isFriend(item.fromUser.id, item.toUser.id);
          if (msgNumber) {
            item.friendMsgNumber = msgNumber.friendMsgNumber;
            item.userMsgNumber = msgNumber.userMsgNumber;
          }
        }

        if (item.msgType === ChatType.群聊) {
          const res = await this.groupChatUserService.findOne(item.toUsers.id);
          if (res.length) {
            const msgNumber = res.filter(i => i.msgNumber > 0 && i.userId === currentUserId) as GroupChatUser[];

            item.friendMsgNumber = msgNumber.length ? msgNumber[0].msgNumber : 0;
          }
        }
      }
    }
    return notices;
  }

  async selectUserFriend(id: number) {
    const allFriends = await this.friendShipRepository
      .createQueryBuilder('friend_ship')
      .where('(friend_ship.userId = :userId or friend_ship.friendId = :userId) and friend_ship.state <> :state', {
        userId: id,
        state: FriendShipEnum.发起,
      })
      .getMany();

    if (allFriends.length) {
      const res = await this.userAuthService.selectAllUser(
        allFriends.map(item => {
          if (item.friendId == id) {
            return item.userId;
          }
          if (item.userId == id) {
            return item.friendId;
          }
        }),
      );
      return {
        content: res,
      };
    } else {
      return {
        content: [],
      };
    }
  }

  async findAllFriend() {
    const res = await this.friendShipRepository.find();
    res.forEach(item => {
      if (item.createdTime) {
        item.createdTime = new Date(item.createdTime).toLocaleString() as any;
      }
    });
    return res;
  }

  // 判断是否为好友
  async isFriend(userId: number, friendId: number) {
    return this.friendShipRepository
      .createQueryBuilder('friend_ship')
      .where(
        '(friend_ship.userId = :userId and friend_ship.friendId = :friendId) or (friend_ship.userId = :friendId and friend_ship.friendId = :userId)',
        {
          userId,
          friendId,
        },
      )
      .getOne();
  }
}
