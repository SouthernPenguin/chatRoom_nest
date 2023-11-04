import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpUserPassWord {
  @IsString()
  @Length(6)
  @ApiProperty({
    example: '',
    description: '密码',
    name: 'oldPassword',
    type: String,
  })
  @IsNotEmpty({ groups: ['create'], message: '老密码必须填写' })
  oldPassword: string;

  @IsString()
  @Length(6)
  @ApiProperty({
    example: '',
    description: '密码',
    name: 'newPassword',
    type: String,
  })
  @IsNotEmpty({ groups: ['create'], message: '新密码必须填写' })
  newPassword: string;
}
