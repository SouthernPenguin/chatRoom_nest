import { Injectable, BadRequestException } from '@nestjs/common';
import { UserAuthService } from 'src/user/userAuth.service';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShip } from './entities/friend-ship.entity';
import { In, Repository } from 'typeorm';
import { ChatType, FriendShipEnum } from 'src/enum';
import { UserService } from 'src/user/user.service';
import { Notice } from 'src/notification/entities/notice.entity';
import { GroupChatUserService } from 'src/group-chat/group-chat-user.service';
import { GroupChatUser } from 'src/group-chat/entities/group-chat-user.entity';
import { GetFriendDto } from './dto/select-friend-ship';

@Injectable()
export class FriendShipService {
  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    @InjectRepository(FriendShip)
    private friendShipRepository: Repository<FriendShip>,
    private groupChatUserService: GroupChatUserService,
  ) {}

  async selectUser(id: number, query: GetFriendDto) {
    if (!query.name) throw new BadRequestException('请输入用户名');
    return await this.userService.selectUser(id, query);
  }

  async selectAwaitFriend(friendId: number) {
    const res = await this.friendShipRepository.find({
      where: {
        friendId,
        state: In([FriendShipEnum.发起, FriendShipEnum.通过]),
      },
    });
    return {
      content: res,
    };
  }

  /*
   * currentUer：当前用户
   * */
  async addUser(currentuserId: number, createFriendShipDto: CreateFriendShipDto) {
    const allUsers = await this.userAuthService.selectAllUser([createFriendShipDto.friendId]);

    if (!allUsers.length) {
      throw new BadRequestException('用户不存在');
    }

    const friend = await this.isFriend(currentuserId, createFriendShipDto.friendId, FriendShipEnum.发起);

    if (friend && friend.fromUserId === currentuserId && friend.state == FriendShipEnum.发起) {
      throw new BadRequestException('已发起好友请求，请等待对方通过');
    }

    if (friend && friend?.id && friend.state == FriendShipEnum.通过) {
      throw new BadRequestException('已经是好友关系');
    }

    // 如果双方同时添加对方好友，直接通过
    if (friend && friend.fromUserId !== currentuserId) {
      return await this.upUserState(friend.id, FriendShipEnum.通过);
    }

    // 创建好友
    const res = this.friendShipRepository.create({
      ...createFriendShipDto,
      userId: currentuserId,
      sortedKey: `${currentuserId}-${createFriendShipDto.friendId}`,
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
  async isFriend(userId: number, friendId: number, state?: FriendShipEnum) {
    const queryBuilder = this.friendShipRepository.createQueryBuilder('friend_ship');
    const slqString = state
      ? 'friend_ship.state = :state and  (friend_ship.userId = :userId and friend_ship.friendId = :friendId) or (friend_ship.userId = :friendId and friend_ship.friendId = :userId)'
      : '(friend_ship.userId = :userId and friend_ship.friendId = :friendId) or (friend_ship.userId = :friendId and friend_ship.friendId = :userId)';
    if (state) {
      return queryBuilder
        .where(slqString, {
          userId,
          friendId,
          state,
        })
        .getOne();
    } else {
      return queryBuilder
        .where(slqString, {
          userId,
          friendId,
        })
        .getOne();
    }
  }
}
