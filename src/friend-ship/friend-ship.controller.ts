import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters } from '@nestjs/common';
import { FriendShipService } from './friend-ship.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { CreatedFriendShipPipe } from './pipe/created-friend-ship.pipe';
import { WsGateway } from 'src/ws/ws.gateway';
import { FriendShipEnum } from 'src/enum';
import { GetFriendDto } from './dto/select-friend-ship';

@Controller('friend-ship')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('好友关系模块')
export class FriendShipController {
  constructor(
    private readonly friendShipService: FriendShipService,
    private readonly ws: WsGateway,
  ) {}

  @Get('/list')
  @ApiOperation({ summary: '用户好友列表' })
  userFriends(@Req() req: Request) {
    return this.friendShipService.selectUserFriend(req['user']['id']);
  }

  @Get('/awaitFriend')
  @ApiOperation({ summary: '等待通过好友列表' })
  awaitPassFriend(@Req() req: Request) {
    return this.friendShipService.selectAwaitFriend(req['user']['id']);
  }

  @Post()
  @ApiOperation({
    summary: '添加好友 前端socket对应名称：awaitFriend(等待通过好友列表) ',
  })
  @ApiBody({ type: CreateFriendShipDto, description: '' })
  async create(@Req() req: Request, @Body(CreatedFriendShipPipe) createFriendShipDto: CreateFriendShipDto) {
    const res = await this.friendShipService.addUser(req['user']['id'], createFriendShipDto);

    const ss = await this.friendShipService.selectAwaitFriend(req['user']['id'] as number);
    if (res.state === FriendShipEnum.发起) {
      this.ws.server.emit('awaitFriend', ss);
    }
    return res;
  }

  @Patch('/:id')
  @ApiOperation({ summary: '通过好友' })
  @ApiParam({
    name: 'id',
    description: 'id',
    required: true,
    type: Number,
  })
  async passCreated(@Param('id') id: number) {
    return this.friendShipService.upUserState(id, FriendShipEnum.通过);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除好友' })
  @ApiParam({
    name: 'id',
    description: '当前记录id',
    required: true,
    type: Number,
  })
  deleteFriend(@Param('id') id: number) {
    return this.friendShipService.upUserState(id, FriendShipEnum.删除);
  }

  @Get()
  @ApiQuery({ type: GetFriendDto, description: '参数可选' })
  @ApiOperation({ summary: '查找好友' })
  async findFriend(@Req() req: Request, @Query() query: GetFriendDto) {
    return await this.friendShipService.selectUser(req['user']['id'], query);
  }
}
