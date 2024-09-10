import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { UrlValidation } from '../classValidator/urlValidator';
export class CreateMenuDto {
  @ApiProperty({ example: '菜单名', description: '菜单名' })
  @IsString()
  @IsNotEmpty({ groups: ['create'], message: '菜单名必须填写' })
  name: string;

  @ApiProperty({ example: '菜单编码', description: '菜单编码' })
  @IsString()
  @IsNotEmpty({ groups: ['create'], message: '菜单编码必须填写' })
  menuCode: string;

  @ApiProperty({
    example: 0,
    description: '节点类型：0目录 1菜单 3按钮',
  })
  @IsNumber()
  @IsNotEmpty({ groups: ['create'], message: '菜单编码必须填写' })
  nodeType: number;

  @ApiProperty({
    example: 0,
    description: '组件名称',
    required: false,
  })
  @IsOptional()
  assemblyName: string;

  @ApiProperty({
    example: 0,
    description: '组件路径',
    required: false,
  })
  @IsOptional()
  assemblyUrl: string;

  @ApiProperty({ example: '路由', description: '路由' })
  @IsString()
  @Validate(UrlValidation, ['nodeType'])
  url: string;

  @ApiProperty({ example: 2, description: '默认值为0父级id', required: false })
  @IsOptional()
  parentId: number;

  @ApiProperty({ example: 1, description: '排序', required: false })
  @IsOptional()
  sort: number;
}
