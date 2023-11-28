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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
    summary:
      '发送信息, 前端socket对应名称：activeUserNoticeList(当前用户消息列表)，activeTowUsers(双方聊天记录)',
  })
  @ApiBody({ type: CreateMessageDto, description: '' })
  async create(
    @Req() req: Request,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const res = await this.messageService.create(createMessageDto);
    const currentUser = await getTokenUser(req); // 当前用户
    const r = await this.messageService.getNewNotice(currentUser?.id);
    this.ws.server.emit('activeUserNoticeList', r);

    // 聊天记录
    this.ws.server.emit(
      'activeTowUsers',
      await this.findAll({
        fromUserId: createMessageDto.fromUserId,
        toUserId: createMessageDto.toUserId,
      } as ListMessageDto),
    );
    return res;
  }

  @Get()
  @ApiOperation({ summary: '聊天记录列表' })
  @ApiQuery({ type: ListMessageDto, description: '' })
  @UseInterceptors(ListInterceptorsInterceptor)
  async findAll(@Query() listMessageDto: ListMessageDto) {
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
  async backMsg(
    @Param('id') id: number,
    @Body() changeMessageState: ChangeMessageState,
  ) {
    const res = await this.messageService.changeMessageState(
      id,
      MessageEnum.撤回,
    );
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
  async remove(
    @Param('id') id: number,
    @Body() changeMessageState: ChangeMessageState,
  ) {
    const res = await this.messageService.changeMessageState(
      id,
      MessageEnum.删除,
    );

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
