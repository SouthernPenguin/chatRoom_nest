import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MessageEnum } from 'src/enum';

export class CreateMessageDto {
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  @ApiProperty({
    example: '',
    description: '内容',
    name: 'postMessage',
    type: String,
  })
  postMessage: string;

  @IsNotEmpty({ message: '发送者id' })
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '发送者id',
    name: 'fromUserId',
    type: Number,
  })
  fromUserId: number;

  @IsNotEmpty({ message: '接收者id' })
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'toUserId',
    type: Number,
  })
  toUserId: number;

  @ApiProperty({
    example: '',
    description: '文件类型',
    name: 'fileType',
    type: String,
  })
  @IsOptional()
  fileType: string;

  @ApiProperty({
    example: '',
    enum: MessageEnum,
    description: '未读:UNREAD/已读:READ/撤回:WITHDRAW/删除:DELETE',
    name: 'toUserId',
  })
  @IsOptional()
  state: MessageEnum;

  @ApiProperty({
    example: '',
    description: '创建时间',
  })
  @IsOptional()
  createdTime: Date;
}
