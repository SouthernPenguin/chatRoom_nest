import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @ApiProperty({
    example: '',
    description: '用户名',
    name: 'name',
    type: String,
  })
  @IsNotEmpty({ groups: ['create'], message: '用户名必须填写' })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: '昵称',
    name: 'nickname',
    required: false,
    type: String,
  })
  nickname: string;

  @IsOptional()
  @ApiProperty({
    example: '',
    description: '头像',
    name: 'headerImg',
    type: String,
    required: false,
  })
  headerImg: string;

  @IsString()
  @Length(6)
  @ApiProperty({
    example: '',
    description: '密码',
    name: 'password',
    type: String,
  })
  @IsNotEmpty({ groups: ['create'], message: '密码必须填写且大于等于6位' })
  password: string;

  @ApiProperty({
    description: '性别：男: 0, 女: 1',
    example: 0,
    name: 'gender',
    type: Number,
    required: false,
  })
  gender: number;
}
