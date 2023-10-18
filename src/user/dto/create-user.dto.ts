import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @ApiProperty({
    example: '',
    description: '用户名',
    name: 'name',
    type: String,
  })
  name: string;

  @IsString()
  @Length(6)
  @ApiProperty({
    example: '',
    description: '密码',
    name: 'password',
    type: Number,
  })
  password: string;

  @IsNumber()
  @IsEnum(
    { 男: 0, 女: 1, 保密: 2 },
    {
      message: 'gender只能传入数字0或1,2',
    },
  )
  @Type(() => Number)
  @ApiProperty({
    description: '性别：男: 0, 女: 1, 保密: 2',
    example: 0,
    name: 'gender',
    type: Number,
  })
  gender: string;
}
