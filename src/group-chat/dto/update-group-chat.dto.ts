import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupChatDto {
  @IsString()
  @IsNotEmpty({ message: '群名称不能为空' })
  @ApiProperty({
    example: '',
    description: '群名称',
    name: 'name',
    type: String,
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '',
    description: '公告',
    name: 'notice',
    type: String,
  })
  notice: string;
}
