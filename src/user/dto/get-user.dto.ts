import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
// import { UpdateUserDto } from './update-user.dto';

// 用户模糊搜索
export class GetUserDto {
  @ApiProperty({ example: '1', description: '页码', required: true })
  @IsOptional()
  page: number;

  @ApiProperty({ example: '10', description: '页数', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: '', description: '综合搜索', required: false })
  @IsOptional()
  blur?: string;
}

// swagger 返回dto
// export class ReturnUserDto {
//   @ApiProperty({ type: [UpdateUserDto], description: '列表内容' })
//   content: UpdateUserDto[];
//   @ApiProperty({ description: '页码' })
//   totalElements: number;
//   @ApiProperty({ description: '页数' })
//   totalPages?: number;
// }
