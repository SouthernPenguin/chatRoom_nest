import { Controller, Delete, Get, Param, Query, UseFilters } from '@nestjs/common';
import { ListSearchDto } from '../dto/list-search.dto';
import { GroupChatAdminService } from './group-chat-admin.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('group-chat-admin')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('后台群管理')
export class GroupChatAdminController {
  constructor(private readonly groupChatAdminService: GroupChatAdminService) {}

  @Get()
  @ApiOperation({ summary: '所有群聊天列表' })
  @ApiQuery({ type: ListSearchDto, description: '' })
  getGroupChatList(@Query() query: ListSearchDto) {
    return this.groupChatAdminService.selectGroupChatList(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '群id',
    required: true,
    type: Number,
  })
  @ApiOperation({ summary: '获取群聊天人员' })
  getGroupChatPeoples(@Param('id') id: number) {
    return this.groupChatAdminService.selectGroupChatPeoples(id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: '群id',
    required: true,
    type: Number,
  })
  @ApiOperation({ summary: '删除群聊天' })
  deleteGroupChat(@Param('id') id: number) {
    return this.groupChatAdminService.deleteGroupChat(id);
  }
}
