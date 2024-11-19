import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseFilters,
  UseInterceptors,
  Param,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { ListMessageDto } from './dto/list-message.dto';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ListInterceptorsInterceptor } from './interceptors/list-interceptors.interceptor';
import { MessageEnum } from 'src/enum';
import { WsGateway } from 'src/ws/ws.gateway';
import { getTokenUser } from 'src/utils';
import { ChangeMessageState } from './dto/change-message-state';
@Controller('message')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('私聊')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly ws: WsGateway,
  ) {}

  @Post()
  @ApiOperation({
    summary: '发送信息, 前端socket对应名称：activeUserNoticeList(当前用户消息列表)，activeTowUsers(双方聊天记录)',
  })
  @ApiBody({ type: CreateMessageDto, description: '' })
  async create(@Req() req: Request, @Body() createMessageDto: CreateMessageDto) {
    try {
      const currentUser = await getTokenUser(req); // 当前用户
      createMessageDto.fromUserId = currentUser?.id;
      const res = await this.messageService.create(createMessageDto, currentUser?.id);

      // 通知
      // const r = await this.messageService.getNewNotice(currentUser?.id);
      // this.ws.server.emit('activeUserNoticeList', r);

      // 聊天记录
      this.ws.server.emit('activeTowUsers', res);

      return res;
    } catch (error) {
      console.log(error, 'error');
    }
  }

  @Put()
  @ApiOperation({ summary: '批量更新信息状态' })
  @ApiQuery({ type: ListMessageDto, description: '' })
  @UseInterceptors(ListInterceptorsInterceptor)
  async messageState(@Req() req: Request, @Query() listMessageDto: ListMessageDto) {
    const currentUser = await getTokenUser(req); // 当前用户
    await this.messageService.upAllState(listMessageDto, currentUser?.id);

    const r = await this.messageService.getNewNotice(currentUser?.id);
    this.ws.server.emit('activeUserNoticeList', r);
  }

  @Get()
  @ApiOperation({ summary: '聊天记录列表' })
  @ApiQuery({ type: ListMessageDto, description: '' })
  @UseInterceptors(ListInterceptorsInterceptor)
  async findAll(@Query() listMessageDto: ListMessageDto, @Req() req?: Request) {
    const currentUser = await getTokenUser(req); // 当前用户
    if (currentUser) {
      listMessageDto.fromUserId = currentUser?.id;
    }
    return await this.messageService.findAll(listMessageDto);
  }

  @Post(':id')
  @ApiOperation({ summary: '撤销信息' })
  @ApiBody({ type: ChangeMessageState, description: '' })
  @ApiParam({
    name: 'id',
    description: '信息id',
    required: true,
    type: Number,
  })
  async backMsg(@Param('id') id: number, @Body() changeMessageState: ChangeMessageState, @Req() req?: Request) {
    const res = await this.messageService.changeMessageState(id, MessageEnum.撤回);
    // 聊天记录
    const currentUser = await getTokenUser(req); // 当前用户
    this.ws.server.emit(
      'activeTowUsers',
      await this.findAll({
        fromUserId: currentUser?.id,
        toUserId: changeMessageState.toUserId,
      } as ListMessageDto),
    );
    return res;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除信息' })
  @ApiBody({ type: ChangeMessageState, description: '' })
  @ApiParam({
    name: 'id',
    description: '信息id',
    required: true,
    type: Number,
  })
  @ApiBody({ type: ChangeMessageState, description: '' })
  async remove(@Param('id') id: number, @Body() changeMessageState: ChangeMessageState) {
    const res = await this.messageService.changeMessageState(id, MessageEnum.删除);

    // 聊天记录
    this.ws.server.emit(
      'activeTowUsers',
      await this.findAll({
        fromUserId: changeMessageState.fromUserId,
        toUserId: changeMessageState.toUserId,
      } as ListMessageDto),
    );
    return res;
  }
}
