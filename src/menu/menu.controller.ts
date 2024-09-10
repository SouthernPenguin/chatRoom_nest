import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/global/guard/jwt.guards';
import { MenusService } from './menu.service';
import { CreateMenuDtoPipe } from './pipe/create-menu.dto/create-menu.dto.pipe';
import { getTokenUser } from 'src/utils';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('menus')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard) // 校验token是否通过
@ApiTags('菜单模块')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('/detail/:id')
  @ApiOperation({ summary: '菜单详情' })
  @ApiParam({ name: 'id', required: true, description: 'id' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateMenuDto],
  })
  findOne(@Param('id') id: number) {
    return this.menusService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiBody({ type: CreateMenuDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateMenuDto,
  })
  create(@Body(CreateMenuDtoPipe) createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '全部菜单' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateMenuDto],
  })
  async findAll(@Req() req: Request) {
    const currentUser = await getTokenUser(req);
    return this.menusService.findAll(currentUser.roleId as number[]);
  }

  @Get(':id')
  @ApiOperation({ summary: '子集菜单' })
  @ApiParam({ name: 'id', required: true, description: '父级id' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: [CreateMenuDto],
  })
  async findChildren(@Param('id') id: number) {
    const res = await this.menusService.findChildren(id);
    if (res.length) {
      res.forEach((item) => {
        item['children'] = [];
      });
    }
    return res;
  }

  @Patch(':id')
  @ApiOperation({ summary: '菜单更新' })
  @ApiParam({ name: 'id', required: true, description: '当前层级id' })
  @ApiBody({ type: CreateMenuDto, description: '' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: CreateMenuDto,
  })
  update(@Param('id') id: number, @Body() updateMenuDto: CreateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '菜单删除' })
  @ApiParam({ name: 'id', required: true, description: '当前层级id' })
  @ApiResponse({
    status: 200,
    description: '成功返回200，失败返回400',
    type: Object,
  })
  remove(@Param('id') id: number) {
    return this.menusService.remove(id);
  }
}
