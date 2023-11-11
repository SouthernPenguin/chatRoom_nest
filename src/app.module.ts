import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'winston-daily-rotate-file';
import { format, transports } from 'winston';

import { connectionParams } from '../ormconfig';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './global/middleware/logger.middleware';
import { GlobalHttpExceptionFilter } from './global/filter/http-exception.filter';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './global/guard/jwt.gateway';
import { UploadModule } from './upload/upload.module';
import { FriendShipModule } from './friend-ship/friend-ship.module';
import { MessageModule } from './message/message.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionParams),
    WinstonModule.forRoot({
      transports: [
        new transports.DailyRotateFile({
          dirname: `logs`,
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(
              (info) =>
                `${info.timestamp} [${info.level}] : ${info.message} ${
                  Object.keys(info).length ? JSON.stringify(info, null, 2) : ''
                }`,
            ),
          ),
        }),
      ],
    }),
    UserModule,
    AuthModule,
    UploadModule,
    FriendShipModule,
    MessageModule,
    ChatroomModule,
  ],
  controllers: [],
  providers: [
    // {
    //   // JWT认证
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR, // 在这里注册
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
