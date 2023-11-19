import {
  Controller,
  Get,
  UseFilters,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MessageEnum } from 'src/enum';
import { NotificationService } from './notification.service';
import { getTokenUser } from 'src/utils';

@Controller('notice')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('消息列表')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
