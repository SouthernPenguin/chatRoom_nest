import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from 'src/user/userAuth.service';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShip } from './entities/friend-ship.entity';
import { Repository } from 'typeorm';
import { DeleteUserDto } from './dto/delete-friend-ship.dto';
import { FriendShipEnum } from 'src/enum';

@Injectable()
export class FriendShipService {
  constructor(
    private userAuthService: UserAuthService,
    @InjectRepository(FriendShip)
    private friendShipRepository: Repository<FriendShip>,
  ) {}

  async selectUser(name: string) {
    return await this.userAuthService.selectUserName(name);
  }

  async selectAwaitFriend(id: number) {
    const res = await this.friendShipRepository.find({
      where: {
        userId: id,
        state: FriendShipEnum.发起,
      },
    });
    const list = await this.userAuthService.selectAllUser(
      res.map((item) => item.friendId),
    );
    return {
      content: list,
    };
  }

  async addUser(createFriendShipDto: CreateFriendShipDto) {
    const allUsers = await this.userAuthService.selectAllUser([
      createFriendShipDto.friendId,
      createFriendShipDto.userId,
    ]);

    if (allUsers.length < 2) {
      throw new UnauthorizedException('好友不存在');
    }

    const friend = await this.isFriend(
      createFriendShipDto.userId,
      createFriendShipDto.friendId,
    );
    if (friend && friend?.id && friend.state == FriendShipEnum.通过) {
      throw new UnauthorizedException('已经是好友关系');
    }

    // 更新好友状态
    if (friend && friend.state == FriendShipEnum.发起) {
      const res = await this.friendShipRepository
        .createQueryBuilder('friend_ship')
        .update(FriendShip)
        .set({ state: FriendShipEnum.通过 })
        .where('id = :id', { id: friend.id })
        .execute();

      if (res.affected > 0) {
        friend.state = FriendShipEnum.通过;
        return friend;
      }
    }

    const res = await this.friendShipRepository.create(createFriendShipDto);
    res.createdTime = new Date();
    return this.friendShipRepository.save(res);
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const friend = await this.isFriend(
      deleteUserDto.userId,
      deleteUserDto.friendId,
    );
    if (!friend?.id) {
      throw new UnauthorizedException('不是好友关系');
    }
    friend.state = FriendShipEnum.发起;

    return this.friendShipRepository.save(friend);
  }

  async selectUserFriend(id: number) {
    const allFriends = await this.friendShipRepository.find({
      where: {
        userId: id,
      },
    });
    if (allFriends.length) {
      const res = await this.userAuthService.selectAllUser(
        allFriends.map((item) => item.friendId),
      );
      return {
        content: res,
      };
    } else {
      return '好友列表为空';
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
