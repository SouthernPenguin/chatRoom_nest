import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from 'src/user/userAuth.service';
import { SystemUserService } from 'src/ststem-user/ststem-user.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    private systemUserService: SystemUserService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const res = await this.userAuthService.selectUser(loginAuthDto);
    if (!res) {
      throw new BadRequestException('账号密码错误');
    }
    const payload = { username: res.name, id: res.id };
    return {
      userInfo: res,
      token: this.jwtService.sign(payload, {
        expiresIn: '1h', //1小时过期，这里短点方便验证
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d', //7天过期
      }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      // 校验token
      const payload = this.jwtService.verify(refreshToken);

      // 获取用户信息
      const user = await this.userService.findOne(payload.id);
      if (user.id) {
        return {
          token: this.jwtService.sign(
            { username: user.name, id: user.id },
            {
              expiresIn: '1h', //1小时过期，这里短点方便验证
            },
          ),
          refreshToken: this.jwtService.sign(
            { username: user.name, id: user.id },
            {
              expiresIn: '7d', //7天过期
            },
          ),
        };
      } else {
        throw new HttpException('refresh_token已过期', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('refresh_token已过期', HttpStatus.BAD_REQUEST);
    }
  }

  async register(createAuthDto: CreateUserDto) {
    const res = await this.userAuthService.selectUserName(createAuthDto.name);
    if (res?.name) {
      throw new BadRequestException('用户名重复');
    }
    return this.userAuthService.create(createAuthDto);
  }

  async systemUserLogin(loginAuthDto: LoginAuthDto) {
    const res = await this.systemUserService.loginSystemUser(loginAuthDto.name, loginAuthDto.password);
    if (!res) {
      throw new BadRequestException('账号密码错误');
    }
    const token = await this.jwtService.signAsync({
      username: res.name,
      id: res.id,
      roleId: res.roles.map(r => r.id),
    });

    return {
      userInfo: res,
      token,
    };
  }
}
