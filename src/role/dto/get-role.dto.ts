import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

// 用户模糊搜索
export class GetRoleDto {
  @ApiProperty({ example: '1', description: '页码', required: true })
  @IsOptional()
  page: number;

  @ApiProperty({ example: '10', description: '页数', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: '', description: '角色搜索', required: false })
  @IsOptional()
  name?: string;
}

// swagger 返回dto
export class ReturnGetRoleList {
  @ApiProperty({
    type: [{ name: String, id: Number }],
    description: '列表内容',
  })
  content: { name: string; id: number }[];
  @ApiProperty({ description: '页码' })
  totalElements: number;
  @ApiProperty({ description: '页数' })
  totalPages?: number;
}
