import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { FriendShipEnum } from 'src/enum';

export class CreateFriendShipDto {
  // 后面直接从token中获取
  // @IsNumber()
  // @IsNotEmpty({ message: '用户id不能为空' })
  // @ApiProperty({
  //   example: '',
  //   description: '用户id',
  //   name: 'userId',
  //   type: String,
  // })
  // userId: number;

  @IsNumber()
  @IsNotEmpty({ message: '好友id不能为空' })
  @ApiProperty({
    example: '',
    description: '好友id',
    name: 'friendId',
    type: String,
  })
  friendId: number;

  @IsNotEmpty({ message: '发送者id' })
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '发送者id',
    name: 'fromUserId',
    type: Number,
  })
  fromUserId: number;

  // @IsNotEmpty({ message: '接收者id' })
  // @IsNumber()
  // @ApiProperty({
  //   example: '',
  //   description: '接收者id',
  //   name: 'toUserId',
  //   type: Number,
  // })
  // toUserId: number;

  @ApiProperty({
    example: '',
    description: '备注',
    name: 'notes',
    type: String,
  })
  @IsOptional()
  notes: string;

  sortedKey: string;
  state: FriendShipEnum;
}
