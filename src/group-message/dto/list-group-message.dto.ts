import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class ListGroupMessageDto {
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
}
