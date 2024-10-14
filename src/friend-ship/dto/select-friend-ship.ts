import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// 用户模糊搜索
export class GetFriendDto {
  @ApiProperty({ example: '1', description: '页码', required: true })
  @IsOptional()
  page: number;

  @ApiProperty({ example: '10', description: '页数', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: '', description: '用户名', required: false })
  @IsOptional()
  name?: string;
}

// swagger 返回dto
// export class ReturnSystemUserDto {
//   @ApiProperty({ type: [ReturnListDto], description: '列表内容' })
//   content: ReturnListDto[];
//   @ApiProperty({ description: '页码' })
//   totalElements: number;
//   @ApiProperty({ description: '页数' })
//   totalPages?: number;
// }
