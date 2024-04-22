import { Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { RedisService } from './redis.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('redis')
@UseFilters(HttpExceptionFilter, TypeormFilter)
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('set/:key/:value')
  async setKey(@Param('key') key: string, @Param('value') value: string) {
    return await this.redisService.setValue(key, value);
  }

  @Post('set/:key/:value')
  async setPostKey(@Param('key') key: string, @Param('value') value: string) {
    return await this.redisService.setValue(key, value);
  }

  @Get('get/:key')
  async getValue(@Param('key') key: string) {
    return await this.redisService.getValue(key);
  }
}
