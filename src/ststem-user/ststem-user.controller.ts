import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetSystemUserDto,
  ReturnSystemUserDto,
} from './dto/get-system-user.dto';
import { JwtGuard } from 'src/global/guard/jwt.guards';
import { SystemUserService } from './ststem-user.service';
import { CreateSystemUserDto } from './dto/create-ststem-user.dto';
import {
  ChangeSystemUserPasswordDto,
  UpdateSystemUserDto,
} from './dto/update-ststem-user.dto';

@Controller('system-user')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard) // 校验token是否通过
@ApiTags('系统用户')
export class SystemUserController {
  constructor(private readonly systemUserService: SystemUserService) {}

  @Patch('/changePassword/:id')
  @ApiOperation({ summary: '系统用户修改密码' })
  @ApiParam({ name: 'id', required: true, description: '当前用户id' })
  @ApiBody({ type: ChangeSystemUserPasswordDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: ChangeSystemUserPasswordDto,
  })
  async upPassword(
    @Body() changeSystemUserPasswordDto: ChangeSystemUserPasswordDto,
    @Param('id') id: number,
  ) {
    return this.systemUserService.updatePassword(
      id,
      changeSystemUserPasswordDto,
    );
  }

  @Post()
  @ApiOperation({ summary: '创建系统用户' })
  @ApiBody({ type: CreateSystemUserDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateSystemUserDto,
  })
  create(@Body() createSystemUserDto: CreateSystemUserDto) {
    return this.systemUserService.create(createSystemUserDto);
  }

  @Get()
  @ApiOperation({ summary: '所有系统用户' })
  @ApiQuery({ type: GetSystemUserDto, description: '参数可选' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: ReturnSystemUserDto,
  })
  findAll(@Query() query: GetSystemUserDto) {
    return this.systemUserService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '创建系统详情' })
  @ApiParam({ name: 'id', required: true, description: '系统用户id' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateSystemUserDto,
  })
  findOne(@Param('id') id: number) {
    return this.systemUserService.findDetail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '系统用户更新' })
  @ApiParam({ name: 'id', required: true, description: '当前用户id' })
  @ApiBody({ type: UpdateSystemUserDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateSystemUserDto,
  })
  async update(
    @Body() updateSystemUserDto: UpdateSystemUserDto,
    @Param('id') id: number,
  ) {
    return this.systemUserService.update(id, updateSystemUserDto);
  }
}
