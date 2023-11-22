import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { FriendShipService } from './friend-ship.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateFriendShipDto } from './dto/create-friend-ship.dto';
import { CreatedFriendShipPipe } from './pipe/created-friend-ship.pipe';
import { DeleteUserDto } from './dto/delete-friend-ship.dto';

interface FindFriend {
  name: string;
}

@Controller('friend-ship')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('好友关系模块')
export class FriendShipController {
  constructor(private readonly friendShipService: FriendShipService) {}

  // 获取添加分页
  // @Get('/list')
  // allFriends() {
  //   return this.friendShipService.findAllFriend();
  // }

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
  @ApiOperation({ summary: '添加好友/通过好友' })
  @ApiQuery({ type: CreateFriendShipDto, description: '' })
  create(
    @Body(CreatedFriendShipPipe) createFriendShipDto: CreateFriendShipDto,
  ) {
    return this.friendShipService.addUser(createFriendShipDto);
  }

  @Delete()
  @ApiOperation({ summary: '删除好友' })
  @ApiQuery({ type: DeleteUserDto, description: '' })
  deleteFriend(@Body() deleteUserDto: DeleteUserDto) {
    return this.friendShipService.deleteUser(deleteUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    description: '用户名',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: '查找好友' })
  findFriend(@Query() query: FindFriend) {
    return this.friendShipService.selectUser(query.name);
  }
}
