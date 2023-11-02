import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const res = await this.userService.selectUser(loginAuthDto);
    if (!res) {
      return '账号密码错误';
    }
    const payload = { username: res.name, id: res.id };
    return {
      userInfo: res,
      token: this.jwtService.sign(payload),
    };
  }

  register(createAuthDto: CreateUserDto) {
    return this.userService.create(createAuthDto);
  }
}
