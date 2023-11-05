import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from 'src/user/userAuth.service';

@Injectable()
export class AuthService {
  constructor(
    private userAuthService: UserAuthService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const res = await this.userAuthService.selectUser(loginAuthDto);
    if (!res) {
      throw new UnauthorizedException('账号密码错误');
    }
    const payload = { username: res.name, id: res.id };
    return {
      userInfo: res,
      token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthDto: CreateUserDto) {
    const res = await this.userAuthService.selectUserName(createAuthDto.name);
    if (res?.name) {
      throw new UnauthorizedException('用户名重复');
    }
    return this.userAuthService.create(createAuthDto);
  }
}
