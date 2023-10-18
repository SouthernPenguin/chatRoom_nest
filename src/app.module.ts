import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'winston-daily-rotate-file';
import { format, transports } from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { connectionParams } from '../ormconfig';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './global/middleware/logger/logger.middleware';
import { HttpExceptionFilter } from './global/filter/http-exception.filter';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR, // 在这里注册
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
