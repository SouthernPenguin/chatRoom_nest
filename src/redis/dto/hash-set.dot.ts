import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ChatType } from 'src/enum';

// 用户模糊搜索
export class HashSetDto {
  @IsEnum(ChatType)
  @ApiProperty({
    example: '',
    description: '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
    name: 'msgType',
    type: 'enum',
  })
  msgType: ChatType;

  @IsNumber()
  @ApiProperty({
    example: '',
    description: '用户id',
    name: 'userId',
    type: Number,
  })
  userId: number;

  @IsNumber()
  @ApiProperty({
    example: '',
    description: '对方id',
    name: 'toUserId',
    type: Number,
  })
  toUserId: number;
}
