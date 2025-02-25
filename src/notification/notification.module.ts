import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { WsModule } from 'src/ws/ws.module';
import { GroupChatUser } from 'src/group-chat/entities/group-chat-user.entity';
import { FriendShipModule } from 'src/friend-ship/friend-ship.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice, GroupChatUser]), FriendShipModule, WsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
