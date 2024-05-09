import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseFilters,
  Query,
} from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { getTokenUser } from 'src/utils';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MessageEnum } from 'src/enum';
import { ListGroupMessageDto } from './dto/list-group-message.dto';
import { WsGateway } from 'src/ws/ws.gateway';
import { BackMessageDto } from './dto/back-message.dto';

@Controller('group-message')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('群聊发送信息')
export class GroupMessageController {
  constructor(
    private readonly groupMessageService: GroupMessageService,
    private readonly ws: WsGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: '发送信息' })
  @ApiBody({ type: CreateGroupMessageDto, description: '' })
  async create(
    @Req() req: Request,
    @Body() createGroupMessageDto: CreateGroupMessageDto,
  ) {
    const currentUser = await getTokenUser(req); // 当前用户
    createGroupMessageDto.fromUserId = currentUser?.id;
    const res = await this.groupMessageService.create(createGroupMessageDto);

    // 通知
    const r = await this.groupMessageService.getNewNotice(currentUser?.id);
    this.ws.server.emit('activeUserNoticeList', r);

    // 聊天记录
    this.ws.server.emit(
      'activeTowUsers',
      await this.findOne(createGroupMessageDto.groupId, {
        page: 1,
        limit: 10,
        createdTime: [],
      }),
    );

    return res;
  }

  @Get(':id')
  @ApiOperation({ summary: '群聊详情信息' })
  @ApiParam({ name: 'id' })
  async findOne(
    @Param('id') id: number | string,
    @Query() listGroupMessage: ListGroupMessageDto,
    @Req() req?: Request,
  ) {
    const currentUser = await getTokenUser(req); // 当前用户
    return this.groupMessageService.findAll(
      id,
      listGroupMessage,
      currentUser?.id,
    );
  }

  @Post('/backMsg')
  @ApiOperation({ summary: '撤销信息' })
  @ApiBody({ type: BackMessageDto, description: '' })
  async update(@Req() req: Request, @Body() backMessageDto: BackMessageDto) {
    const currentUser = await getTokenUser(req); // 当前用户
    const res = await this.groupMessageService.update(
      currentUser?.id,
      backMessageDto.id,
      MessageEnum.撤回,
    );
    // 聊天记录
    this.ws.server.emit(
      'activeTowUsers',
      await this.findOne(backMessageDto.groupId, {
        page: 1,
        limit: 10,
        createdTime: [],
      }),
    );

    return res;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除信息' })
  @ApiParam({ name: 'id' })
  async remove(@Req() req: Request, @Param('id') id: number) {
    const currentUser = await getTokenUser(req); // 当前用户
    return this.groupMessageService.update(
      currentUser?.id,
      id,
      MessageEnum.删除,
    );
  }
}
