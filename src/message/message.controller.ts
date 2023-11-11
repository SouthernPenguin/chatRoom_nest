import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseFilters,
  UseInterceptors,
  Param,
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

@Controller('message')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('私聊')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: '发送信息' })
  @ApiBody({ type: CreateMessageDto, description: '' })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: '聊天记录列表' })
  @ApiQuery({ type: ListMessageDto, description: '' })
  @UseInterceptors(ListInterceptorsInterceptor)
  async findAll(@Query() listMessageDto: ListMessageDto) {
    return await this.messageService.findAll(listMessageDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '撤销信息' })
  @ApiParam({
    name: 'id',
    description: '信息id',
    required: true,
    type: Number,
  })
  findOne(@Param('id') id: number) {
    return this.messageService.changeMessageState(id, MessageEnum.撤回);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: '删除信息' })
  // @ApiParam({
  //   name: 'id',
  //   description: '信息id',
  //   required: true,
  //   type: Number,
  // })
  // remove(@Param('id') id: number) {
  //   return this.messageService.changeMessageState(id, MessageEnum.删除);
  // }
}
