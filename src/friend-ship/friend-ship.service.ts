import { Injectable, BadRequestException } from '@nestjs/common';
import { UserAuthService } from 'src/user/userAuth.service';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShip } from './entities/friend-ship.entity';
import { Repository } from 'typeorm';
import { FriendShipEnum } from 'src/enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendShipService {
  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    @InjectRepository(FriendShip)
    private friendShipRepository: Repository<FriendShip>,
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

    const friend = await this.isFriend(
      createFriendShipDto.userId,
      createFriendShipDto.friendId,
    );

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

  async upUserState(id: number, type: FriendShipEnum) {
    const res = await this.friendShipRepository.findOne({
      where: {
        id,
      },
    });
    res.state = type;
    return this.friendShipRepository.save(res);
  }

  async selectUserFriend(id: number) {
    const allFriends = await this.friendShipRepository
      .createQueryBuilder('friend_ship')
      .where(
        '(friend_ship.userId = :userId or friend_ship.friendId = :userId) and friend_ship.state <> :state',
        {
          userId: id,
          state: FriendShipEnum.发起,
        },
      )
      .getMany();

    if (allFriends.length) {
      const res = await this.userAuthService.selectAllUser(
        allFriends.map((item) => {
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
    res.forEach((item) => {
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
