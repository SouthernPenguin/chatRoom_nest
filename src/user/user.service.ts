import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpUserPassWord } from './dto/update.userPassWord';
import { encrypt } from 'src/utils/crypto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: GetUserDto) {
    const { page, limit, blur } = query;

    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    if (blur) {
      queryBuilder.andWhere(
        '(user.name LIKE :searchQuery OR user.nickname LIKE :searchQuery)',
        {
          searchQuery: `%${blur}%`,
        },
      );
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
    throw new UnauthorizedException('用户不存在');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const res = await this.findOne(id);
    if (res?.id) {
      const newRes = this.userRepository.merge(res, updateUserDto);
      return this.userRepository.save(newRes);
    }
    throw new UnauthorizedException('用户不存在');
  }

  async updatePassword(id: number, updateUserDto: UpUserPassWord) {
    const res = await this.findOne(id);
    if (res?.id && res.password === encrypt(updateUserDto.oldPassword)) {
      res.password = encrypt(updateUserDto.newPassword);
      return this.userRepository.save(res);
    }
    if (res.password !== encrypt(updateUserDto.oldPassword)) {
      throw new UnauthorizedException('密码不正确');
    }
    throw new UnauthorizedException('用户不存在');
  }

  async remove(id: number) {
    const res = await this.findOne(id);
    if (res?.id) {
      return await this.userRepository.remove(res);
    }
    return new UnauthorizedException('学生不存在！');
  }
}
