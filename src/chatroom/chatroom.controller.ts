import {
  Controller,
  Get,
  UseFilters,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MessageEnum } from 'src/enum';

@Controller('chatroom')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('聊天列表')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get(':id')
  @ApiOperation({ summary: '当前用户聊天列表' })
  @ApiParam({
    name: 'id',
    description: '信息id',
    required: true,
    type: Number,
  })
  findOne(@Param('id') id: number) {
    return this.chatroomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '查看/删除,聊天列表记录' })
  @ApiParam({
    name: 'id',
    description: '当前记录id',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'state',
    enum: MessageEnum,
    description: '已读 = READ;删除 = DELETE',
  })
  async changeState(
    @Param('id') id: number,
    @Query('state') state: MessageEnum,
  ) {
    return await this.chatroomService.upDateState(id, state);
  }
}
