import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @ApiProperty({
    example: '',
    description: '用户名',
    name: 'name',
    type: String,
  })
  @IsNotEmpty({ message: '用户名必须填写' })
  name: string;

  @IsString()
  @ApiProperty({
    example: '',
    description: '用户名',
    name: 'password',
    type: String,
  })
  @IsNotEmpty({ message: '密码必须填写' })
  password: string;
}

export class RefreshDto {
  @IsString()
  @ApiProperty({
    example: '',
    description: 'refresh',
    name: 'refresh',
    type: String,
  })
  @IsNotEmpty({ message: 'refresh必须填写' })
  refresh: string;
}
