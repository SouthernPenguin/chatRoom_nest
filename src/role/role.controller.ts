import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './role.service';
import { GetRoleDto } from './dto/get-role.dto';
import { JwtGuard } from 'src/global/guard/jwt.guards';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('roles')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard) // 校验token是否通过
@ApiTags('角色模块')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiBody({ type: CreateRoleDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateRoleDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '全部角色' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateRoleDto],
  })
  findAll(@Query() query: GetRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '角色详情' })
  @ApiParam({ name: 'id', required: true, description: 'id' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateRoleDto],
  })
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '角色更新' })
  @ApiParam({ name: 'id', required: true, description: '请传入id' })
  @ApiBody({ type: UpdateRoleDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateRoleDto],
  })
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
