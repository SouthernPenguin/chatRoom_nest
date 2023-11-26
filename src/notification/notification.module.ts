import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), WsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
