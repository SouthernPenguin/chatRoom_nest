import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendShipDto {
  // 后面直接从token中获取
  @IsNumber()
  @IsNotEmpty({ message: '用户id不能为空' })
  @ApiProperty({
    example: '',
    description: '用户id',
    name: 'userId',
    type: String,
  })
  userId: number;

  @IsNumber()
  @IsNotEmpty({ message: '好友id不能为空' })
  @ApiProperty({
    example: '',
    description: '好友id',
    name: 'friendId',
    type: String,
  })
  friendId: number;

  sortedKey: string;
  state: boolean;
}
