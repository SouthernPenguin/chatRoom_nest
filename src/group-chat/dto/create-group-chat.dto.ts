import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateGroupChatDto {
  @IsString()
  @IsNotEmpty({ message: '群名称不能为空' })
  @ApiProperty({
    example: '',
    description: '群名称',
    name: 'name',
    type: String,
  })
  name: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { each: true },
  )
  @IsNotEmpty({ message: '请选择用户' })
  @ApiProperty({
    example: '',
    description: '用户id',
    name: 'userIds',
    type: Array,
  })
  userIds: number[];

  users: User[];

  // 创建用户
  createdUserId: User;
}
