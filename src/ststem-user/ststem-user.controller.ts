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
import { UpdateSystemUserDto } from './dto/update-ststem-user.dto';
import { getTokenUser } from 'src/utils';

@Controller('system-user')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard) // 校验token是否通过
@ApiTags('系统用户')
export class SystemUserController {
  constructor(private readonly systemUserService: SystemUserService) {}

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

  @Patch()
  @ApiOperation({ summary: '系统用户更新' })
  @ApiBody({ type: UpdateSystemUserDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateSystemUserDto,
  })
  async update(
    @Body() updateSystemUserDto: UpdateSystemUserDto,
    @Req() req: Request,
  ) {
    const currentUser = await getTokenUser(req); // 当前用户
    return this.systemUserService.update(currentUser.id, updateSystemUserDto);
  }
}
