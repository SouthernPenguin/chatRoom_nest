import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { encrypt } from 'src/utils/crypto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserAuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  // 创建用户
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    user.password = encrypt(createUserDto.password);
    return await this.userRepository.save(user);
  }

  // 登录查询
  async selectUser(loginAuthDto: LoginAuthDto) {
    return await this.userRepository.findOne({
      where: {
        name: loginAuthDto.name,
        password: encrypt(loginAuthDto.password),
      },
    });
  }

  // 查询用户是否以创建
  async selectUserName(userName: string) {
    return await this.userRepository.findOne({
      where: {
        name: userName,
      },
    });
  }

  // 批量查询用户，可用于放回实体集合
  async selectAllUser(id: number[]) {
    return await this.userRepository.find({
      where: {
        id: In(id),
      },
    });
  }
}
