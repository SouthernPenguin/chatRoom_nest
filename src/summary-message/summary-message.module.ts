import { Module } from '@nestjs/common';
import { SummaryMessageService } from './summary-message.service';
import { SummaryMessageController } from './summary-message.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendShip } from 'src/friend-ship/entities/friend-ship.entity';
import { FriendShipModule } from 'src/friend-ship/friend-ship.module';
import { GroupChatModule } from 'src/group-chat/group-chat.module';

@Module({
  imports: [UserModule, GroupChatModule, FriendShipModule, TypeOrmModule.forFeature([FriendShip])],
  controllers: [SummaryMessageController],
  providers: [SummaryMessageService],
})
export class SummaryMessageModule {}
