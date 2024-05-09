import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsArray, IsOptional } from 'class-validator';

export class ListMessageDto extends OmitType(CreateMessageDto, [
  'postMessage',
  'state',
  'fileType',
  'msgType',
]) {
  @ApiProperty({ example: '1', description: '页码', required: true })
  @IsOptional()
  page: number;

  @ApiProperty({ example: '10', description: '页数', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    example: '[2022-02-2,2023-05-9]',
    description: '时间范围',
  })
  @IsArray()
  @IsOptional()
  createdTime: any;

  // @ApiProperty({
  //   example: '[1,2]',
  //   description: '[上个聊天用户,当前用户]',
  // })
  // @IsOptional()
  // @IsArray()
  // selectUsersIds: number[];
}
