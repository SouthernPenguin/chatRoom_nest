import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChatType } from 'src/enum';

export class CreateGroupMessageDto {
  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  @ApiProperty({
    example: '',
    description: '内容',
    name: 'postMessage',
    type: String,
  })
  postMessage: string;

  @IsOptional()
  fileType: string;

  @IsOptional()
  fileSize: string;

  @IsOptional()
  @IsNotEmpty({ message: '发收者id' })
  fromUserId: number;

  @IsNotEmpty({ message: '接收者id' })
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'groupId',
    type: Number,
  })
  groupId: number;

  @IsEnum(ChatType)
  @ApiProperty({
    example: '',
    description: '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
    name: 'msgType',
    type: 'enum',
  })
  msgType: ChatType;
}
