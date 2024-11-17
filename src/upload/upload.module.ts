import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { WsModule } from 'src/ws/ws.module';
import { GroupMessageModule } from 'src/group-message/group-message.module';

import { v4 as uuidv4 } from 'uuid';
import { checkDirAndCreate } from 'src/utils';
import * as moment from 'moment';
@Module({
  imports: [
    GroupMessageModule,
    WsModule,
    UserModule,
    MessageModule,
    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录  path.join(__dirname, '../uploadFiles'), // 通过时间戳来重命名上传的文件名
        destination: (_, file, cb) => {
          // 定义文件上传格式
          const allowedImageTypes = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp', 'svg', 'tiff']; // 图片
          const allowedOfficeTypes = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'txt', 'md', 'csv']; // office
          const allowedVideoTypes = ['mp4', 'avi', 'wmv']; // 视频
          const allowedAudioTypes = ['mp3', 'wav', 'ogg']; // 音频
          // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
          const fileExtension = file.originalname.split('.').pop().toLowerCase();
          let temp = 'other';
          if (allowedImageTypes.includes(fileExtension)) {
            temp = 'image';
          } else if (allowedOfficeTypes.includes(fileExtension)) {
            temp = 'office';
          } else if (allowedVideoTypes.includes(fileExtension)) {
            temp = 'video';
          } else if (allowedAudioTypes.includes(fileExtension)) {
            temp = 'audio';
          }
          // 文件以年月命名文件夹
          const filePath = `uploadFiles/${temp}/${moment().format('YYYY-MM-DD')}`;
          checkDirAndCreate(filePath); // 判断文件夹是否存在，不存在则自动生成
          return cb(null, filePath);
        },
        filename: (_, file, callback) => {
          // 使用随机 uuid 生成文件名
          const filename = `${uuidv4()}.${file.originalname.split('.')[1]}`;
          return callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {}
