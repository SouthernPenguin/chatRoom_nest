import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNotEmpty({ message: '接收者id' })
  @IsNumber()
  @ApiProperty({
    example: '',
    description: '接收者id',
    name: 'toUserId',
    type: Number,
  })
  toUserId: number;
}
