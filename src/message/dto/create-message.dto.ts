import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChatType, MessageEnum } from 'src/enum';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({
    example: '',
    description: '内容',
    name: 'postMessage',
    type: String,
  })
  postMessage: string;

  // @IsNotEmpty({ message: '发送者id' })
  // @IsNumber()
  // @ApiProperty({
  //   example: '',
  //   description: '发送者id',
  //   name: 'fromUserId',
  //   type: Number,
  // })
  fromUserId: number;

  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'toUserId',
    type: Number,
  })
  @IsNotEmpty({ message: '接收者id不能为空' })
  @IsNumber()
  toUserId: number;

  // @ApiProperty({
  //   example: '',
  //   description: '文件类型',
  //   name: 'fileType',
  //   type: String,
  // })
  @IsOptional()
  fileType: string;

  @IsOptional()
  fileSize: string;

  @IsOptional()
  originalFileName: string;

  // @IsEnum(MessageEnum)
  // @ApiProperty({
  //   example: '',
  //   enum: MessageEnum,
  //   description: '未读:UNREAD/已读:READ/撤回:WITHDRAW/删除:DELETE',
  //   name: 'state',
  //   type: 'enum',
  // })
  @IsOptional()
  state: MessageEnum;

  // @ApiProperty({
  //   example: '',
  //   description: '创建时间',
  // })
  @IsOptional()
  createdTime: Date;

  @IsEnum(ChatType)
  @ApiProperty({
    example: '',
    description: '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
    name: 'msgType',
    type: 'enum',
  })
  msgType: ChatType;
}
