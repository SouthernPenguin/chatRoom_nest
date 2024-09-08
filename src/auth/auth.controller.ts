import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/global/decorator/publice.decorator';
import { CreateSystemUserDto } from 'src/ststem-user/dto/create-ststem-user.dto';

@Controller('auth')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('JTW')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginAuthDto, description: '' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: '注册' })
  @ApiBody({ type: CreateUserDto, description: '' })
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('/auth/login')
  @ApiOperation({ summary: '后台系统用户登录' })
  @ApiResponse({ type: CreateSystemUserDto })
  @ApiBody({ type: LoginAuthDto, description: '' })
  systemUserLogin(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.systemUserLogin(loginAuthDto);
  }

  @Public()
  @Post('/auth/register')
  @ApiOperation({ summary: '后台系统用户注册' })
  @ApiResponse({ type: CreateUserDto })
  @ApiBody({ type: CreateUserDto, description: '' })
  systemUserRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
