import {
  Controller,
  Get,
  UseFilters,
  Param,
  Patch,
  Query,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MessageEnum } from 'src/enum';
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
  @ApiOperation({ summary: '想聊天' })
  async wantMessage(@Req() req: Request, @Body() createMessageDto: CreateDto) {
    await this.notificationService.create({
      newMessage: createMessageDto.newMessage,
      fromUserId: createMessageDto.fromUserId,
      toUserId: createMessageDto.toUserId,
    });
    const currentUser = await getTokenUser(req); // 当前用户
    const r = await await this.notificationService.findOne(currentUser?.id);
    this.ws.server.emit('activeUserNoticeList', r);
  }

  @Get()
  @ApiOperation({ summary: '当前用户消息列表' })
  async findOne(@Req() req: Request) {
    const currentUser = await getTokenUser(req); // 当前用户
    return this.notificationService.findOne(currentUser.id);
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
  async changeState(
    @Param('id') id: number,
    @Query('state') state: MessageEnum,
  ) {
    return await this.notificationService.upDateState(id, state);
  }
}
