import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpLoadEnum } from 'src/enum';

@Controller('upload')
@ApiTags('文件上传')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '用户头像上传' })
  @ApiBody({ type: CreateUploadDto, description: '' })
  @ApiQuery({
    name: 'id',
    description: '用户id',
    required: true,
    type: Number,
  })
  @Post('/upLoadUserImage')
  @UseInterceptors(FileInterceptor('file')) // UseInterceptors 处理文件的中间件，file是一个标识名
  upLoadUserImage(
    @Query('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imgTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!imgTypes.includes(file.mimetype)) {
      throw new UnauthorizedException('请上传图片');
    }
    if (typeof id == 'undefined') {
      throw new UnauthorizedException('用户不存在');
    }
    this.uploadService.upLoadUserImageSave(id, file);
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
  upLoadMessage(
    @Query('fromUserId') fromUserId: number,
    @Query('toUserId') toUserId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.uploadService.messageFileSave(toUserId, fromUserId, file);
  }
}
