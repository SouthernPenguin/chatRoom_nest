import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { WsModule } from 'src/ws/ws.module';
import { FriendShipModule } from 'src/friend-ship/friend-ship.module';

@Module({
  imports: [
    FriendShipModule,
    WsModule,
    NotificationModule,
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
