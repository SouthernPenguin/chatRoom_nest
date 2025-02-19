import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpUserPassWord } from './dto/update.userPassWord';
import { encrypt } from 'src/utils/crypto';
import { GetUserDto } from './dto/get-user.dto';
import { GetFriendDto } from 'src/friend-ship/dto/select-friend-ship';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll(query: GetUserDto) {
    const { page, limit, blur } = query;

    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    if (blur) {
      queryBuilder.andWhere('(user.name LIKE :searchQuery OR user.nickname LIKE :searchQuery)', {
        searchQuery: `%${blur}%`,
      });
    }
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

  async findOne(id: number) {
    const res = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (res?.id) {
      return res;
    }
    throw new BadRequestException('用户不存在');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const res = await this.findOne(id);
    if (res?.id) {
      const newRes = this.userRepository.merge(res, updateUserDto);
      return this.userRepository.save(newRes);
    }
    throw new BadRequestException('用户不存在');
  }

  async updatePassword(id: number, updateUserDto: UpUserPassWord) {
    const res = await this.findOne(id);
    if (res?.id && res.password === encrypt(updateUserDto.oldPassword)) {
      res.password = encrypt(updateUserDto.newPassword);
      return this.userRepository.save(res);
    }
    if (res.password !== encrypt(updateUserDto.oldPassword)) {
      throw new BadRequestException('密码不正确');
    }
    throw new BadRequestException('用户不存在');
  }

  async resetPassword(id: number) {
    const res = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (res?.id) {
      res.password = encrypt('123456');
      return this.userRepository.save(res);
    }
  }

  async blackUser(id: number) {
    const res = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    res.isBlack = !res.isBlack;
    return this.userRepository.save(res);
  }

  async remove(id: number) {
    const res = await this.findOne(id);
    if (res?.id) {
      return await this.userRepository.remove(res);
    }
    return new BadRequestException('学生不存在！');
  }

  async selectUser(id: number, query: GetFriendDto) {
    const { page, limit, name } = query;
    const queryBuilder = await this.userRepository.createQueryBuilder('user');

    const count = await queryBuilder
      .where('(user.name LIKE :searchQuery OR user.nickname LIKE :searchQuery)  ', {
        searchQuery: `%${name}%`,
      })
      .andWhere(' (user.id <> :id)', {
        id: id,
      })
      .getCount();

    const content = await queryBuilder
      .skip((page - 1) * limit || 0)
      .take(limit || 10)
      .getMany();
    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  batchUser(ids: number[]) {
    return this.userRepository.createQueryBuilder().where('id IN (:...ids)', { ids }).getMany();
  }
}
