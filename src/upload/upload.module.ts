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

@Module({
  imports: [
    GroupMessageModule,
    WsModule,
    UserModule,
    MessageModule,
    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录
        destination: path.join(__dirname, '../uploadFiles'), // 通过时间戳来重命名上传的文件名
        filename: (_, file, callback) => {
          const suffixName = path.extname(file.originalname);
          let fileName: string = '';
          if (suffixName !== 'png') {
            fileName = decodeURIComponent(escape(file.originalname));
          } else {
            fileName = `${
              new Date().getTime() + path.extname(file.originalname)
            }`;
          }

          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {}
