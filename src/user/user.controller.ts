import { Controller, Get, Body, Patch, Param, Delete, UseFilters, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { UpUserPassWord } from './dto/update.userPassWord';
import { GetUserDto } from './dto/get-user.dto';

@Controller('user')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '用户列表' })
  @ApiQuery({ type: GetUserDto, description: '参数可选' })
  findAll(@Query() query: GetUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: Number,
  })
  @ApiOperation({ summary: '用户详情' })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '用户更新' })
  @ApiBody({ type: UpdateUserDto, description: '' })
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: Number,
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '用户删除' })
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Get('resetPassword/:id')
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '用户密码重置' })
  reset(@Param('id') id: number) {
    return this.userService.resetPassword(id);
  }

  @Get('black/:id')
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '用户拉黑' })
  black(@Param('id') id: number) {
    return this.userService.blackUser(id);
  }

  @Post('changePassword/:id')
  @ApiOperation({ summary: '修改密码' })
  @ApiBody({ type: UpUserPassWord, description: '' })
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: Number,
  })
  upPassword(@Param('id') id: number, @Body() updatePassWordDto: UpUserPassWord) {
    return this.userService.updatePassword(id, updatePassWordDto);
  }
}
