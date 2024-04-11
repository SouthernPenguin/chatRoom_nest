import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseFilters,
} from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { getTokenUser } from 'src/utils';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreatedGroupChatPipe } from './pipe/created-group-chat/created-group-chat.pipe';

@Controller('group-chat')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('创建群聊')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  @ApiOperation({ summary: '创建群' })
  @ApiBody({ type: CreateGroupChatDto, description: '' })
  async create(
    @Req() req: Request,
    @Body(new CreatedGroupChatPipe()) createGroupChatDto: CreateGroupChatDto,
  ) {
    const currentUser = await getTokenUser(req);
    return await this.groupChatService.create(
      currentUser.id,
      createGroupChatDto,
    );
  }

  @Get()
  @ApiOperation({ summary: '群列表' })
  async findAll(@Req() req: Request) {
    const currentUser = await getTokenUser(req);
    return this.groupChatService.findAll(currentUser.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: '群id' })
  @ApiOperation({ summary: '群人员' })
  findOne(@Param('id') id: number) {
    return this.groupChatService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新群名称/公告' })
  @ApiParam({ name: 'id', required: true, description: '群id' })
  @ApiBody({ type: UpdateGroupChatDto, description: '' })
  update(
    @Param('id') id: number,
    @Body() updateGroupChatDto: UpdateGroupChatDto,
  ) {
    return this.groupChatService.update(id, updateGroupChatDto);
  }
}
