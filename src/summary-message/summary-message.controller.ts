import { Controller, Get, Req, UseFilters } from '@nestjs/common';
import { SummaryMessageService } from './summary-message.service';
import { getTokenUser } from 'src/utils';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('summary-message')
@UseFilters(HttpExceptionFilter, TypeormFilter)
@ApiTags('汇总模块')
export class SummaryMessageController {
  constructor(private readonly summaryMessageService: SummaryMessageService) {}

  @Get('/userInform')
  @ApiOperation({ summary: '客户端汇总' })
  async getUserInform(@Req() req: Request) {
    const currentUser = await getTokenUser(req); // 当前用户
    return this.summaryMessageService.selectUserInfo(currentUser.id);
  }
}
