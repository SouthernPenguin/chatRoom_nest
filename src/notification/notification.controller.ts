import { Controller, Get, UseFilters, Param, Patch, Query, Req, Post, Body } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatType, MessageEnum } from 'src/enum';
import { NotificationService } from './notification.service';
import { getTokenUser } from 'src/utils';
import { CreateDto } from './dto/create-notification.dto';
import { WsGateway } from 'src/ws/ws.gateway';

@Controller('notice')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('消息列表')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly ws: WsGateway,
  ) {}

  @Post()
  @ApiOperation({
    summary: '想聊天 前端socket对应名称：activeUserNoticeList(当前用户消息列表)，activeTowUsers(双方聊天记录)',
  })
  async wantMessage(@Req() req: Request, @Body() createMessageDto: CreateDto) {
    await this.notificationService.create({
      newMessage: createMessageDto.newMessage,
      fromUserId: createMessageDto.fromUserId,
      toUserId: (createMessageDto.msgType === ChatType.群聊 ? null : createMessageDto.toUserId) as any,
      groupId: createMessageDto.msgType === ChatType.群聊 ? createMessageDto.toUserId : null,
      msgType: createMessageDto.msgType,
    });
    const currentUser = await getTokenUser(req); // 当前用户
    const r = await await this.notificationService.findOne(currentUser?.id);
    this.ws.server.emit('activeUserNoticeList', r);
  }

  @Get()
  @ApiOperation({ summary: '当前用户消息列表' })
  async findOne(@Req() req: Request) {
    const currentUser = await getTokenUser(req); // 当前用户
    const content = await this.notificationService.findOne(currentUser.id);
    return {
      content,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '查看/删除,消息列表记录' })
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
  async changeState(@Param('id') id: number, @Query('state') state: MessageEnum) {
    return await this.notificationService.upDateState(id, state);
  }
}
