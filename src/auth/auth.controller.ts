import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/global/decorator/publice.decorator';

@Controller('auth')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('JTW')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: '登录' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: '注册' })
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }
}
