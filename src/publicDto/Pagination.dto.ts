import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationBaseDto {
  @ApiProperty({ example: '1', description: '页码', required: true })
  @IsOptional()
  page: number;

  @ApiProperty({ example: '10', description: '页数', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: '', description: '模糊搜索', required: false })
  @IsOptional()
  blurry?: string;
}
