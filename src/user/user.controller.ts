import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('user')
@UseFilters(TypeormFilter)
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '用户列表' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiQuery({
    name: 'id',
    description: '用户id',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '用户详情' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '用户更新' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiQuery({
    name: 'id',
    description: '用户id',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '用户删除' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
