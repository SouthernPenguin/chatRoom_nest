import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { HashSetDto } from './dto/hash-set.dot';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('redis')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('缓存设置')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('set/:key/:value')
  async setKey(@Param('key') key: string, @Param('value') value: string) {
    return await this.redisService.setValue(key, value);
  }

  @Get('get/:key')
  async getValue(@Param('key') key: string) {
    return await this.redisService.getValue(key);
  }

  @Post('setList')
  @ApiOperation({
    summary: '正在聊天的用户',
  })
  @ApiBody({ type: HashSetDto, description: '' })
  async setPostKey(@Body() hashSet: HashSetDto) {
    return this.redisService.setList(hashSet);
  }

  @Get('')
  @ApiOperation({
    summary: '所有列表',
  })
  async getAllRedis() {
    const res = await this.redisService.getAllActiveUser();
    return res.length ? res.map((item: string) => JSON.parse(item)) : [];
  }

  @Delete('')
  @ApiOperation({
    summary: '移除list',
  })
  @ApiBody({ type: HashSetDto, description: '' })
  async delItem(@Body() hashSet: HashSetDto) {
    return await this.redisService.deleteActiveUserItem(
      JSON.stringify(hashSet),
    );
  }
}
