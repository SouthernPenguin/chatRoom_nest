import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Query, Req } from '@nestjs/common';
import { UploadService } from './upload.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateUploadDto } from './dto/create-upload.dto';
import { WsGateway } from 'src/ws/ws.gateway';
import { MessageService } from 'src/message/message.service';
import { ListMessageDto } from 'src/message/dto/list-message.dto';
import { ChatType } from 'src/enum';
import { GroupMessageService } from 'src/group-message/group-message.service';
import { getTokenUser } from 'src/utils';

@Controller('upload')
@ApiTags('文件上传')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly messageService: MessageService,
    private readonly groupMessageService: GroupMessageService,

    private readonly ws: WsGateway,
  ) {}

  @ApiOperation({ summary: '用户头像上传' })
  @ApiBody({ type: CreateUploadDto, description: '' })
  @Post('/upLoadUserImage')
  @UseInterceptors(FileInterceptor('file')) // UseInterceptors 处理文件的中间件，file是一个标识名
  async upLoadUserImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const allowedImageTypes = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp', 'svg', 'tiff'];

    if (!file || allowedImageTypes.findIndex(item => file.originalname.split('.')[1] === item) < 0) {
      throw new BadRequestException('请上传图片');
    }

    const currentUser = await getTokenUser(req); // 当前用户
    this.uploadService.upLoadUserImageSave(currentUser?.id, file);
  }

  @ApiOperation({ summary: '聊天文件上传' })
  @ApiBody({ type: CreateUploadDto, description: '' })
  @ApiQuery({
    name: 'fromUserId',
    description: '发送者id',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'toUserId',
    description: '接收者id',
    required: true,
    type: Number,
  })
  @Post('/upLoadMessage')
  @UseInterceptors(FileInterceptor('file')) // UseInterceptors 处理文件的中间件，file是一个标识名
  async upLoadMessage(
    @Query('fromUserId') fromUserId: number,
    @Query('toUserId') toUserId: number,
    @Query('msgType') msgType: ChatType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.uploadService.messageFileSave(toUserId, fromUserId, file, msgType);
    if (msgType === ChatType.私聊) {
      // 通知
      const r = await this.messageService.getNewNotice(fromUserId);
      this.ws.server.emit('activeUserNoticeList', r);

      // 聊天记录
      this.ws.server.emit(
        'activeTowUsers',
        await this.messageService.findAll({
          fromUserId,
          toUserId,
        } as ListMessageDto),
      );
    }

    if (msgType === ChatType.群聊) {
      // 通知
      const r = await this.groupMessageService.getNewNotice(toUserId);
      this.ws.server.emit('activeUserNoticeList', r);

      // 聊天记录
      this.ws.server.emit(
        'activeTowUsers',
        await this.groupMessageService.findAll(toUserId, {
          page: 1,
          limit: 10,
          createdTime: [],
        }),
      );
    }
  }
}
