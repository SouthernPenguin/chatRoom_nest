import { Module } from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { GroupMessageController } from './group-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './entities/group-message.entity';
import { GroupChatModule } from 'src/group-chat/group-chat.module';
import { NotificationModule } from 'src/notification/notification.module';
import { WsModule } from 'src/ws/ws.module';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    WsModule,
    UserModule,
    NotificationModule,
    GroupChatModule,
    RedisModule,
    TypeOrmModule.forFeature([GroupMessage]),
  ],
  controllers: [GroupMessageController],
  providers: [GroupMessageService],
  exports: [GroupMessageService],
})
export class GroupMessageModule {}
