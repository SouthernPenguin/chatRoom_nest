import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChatType } from 'src/enum';

export class CreateDto {
  @IsString()
  // @IsNotEmpty({ message: '内容不能为空' })
  @ApiProperty({
    example: '',
    description: '发送消息',
    name: 'newMessage',
    type: String,
  })
  newMessage: string | null | undefined;

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
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'toUserId',
    // type: Number,
  })
  toUserId?: any;

  // @IsNotEmpty({ message: '接收者id' })
  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'groupId',
    // type: String || ,
  })
  groupId?: any;

  @IsEnum(ChatType)
  @ApiProperty({
    example: '',
    description: '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
    name: 'msgType',
  })
  msgType: ChatType;
}
