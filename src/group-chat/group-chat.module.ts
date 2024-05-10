import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { GroupChat } from './entities/group-chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { GroupChatUser } from './entities/group-chat-user.entity';
import { GroupChatUserService } from './group-chat-user.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([GroupChat, GroupChatUser])],
  controllers: [GroupChatController],
  providers: [GroupChatService, GroupChatUserService],
  exports: [GroupChatService, GroupChatUserService],
})
export class GroupChatModule {}
