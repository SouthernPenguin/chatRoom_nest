import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat/group-chat.service';
import { GroupChatController } from './group-chat/group-chat.controller';
import { GroupChat } from './entities/group-chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { GroupChatUser } from './entities/group-chat-user.entity';
import { GroupChatUserService } from './group-chat-user/group-chat-user.service';
import { GroupChatAdminService } from './group-chat-admin/group-chat-admin.service';
import { GroupChatAdminController } from './group-chat-admin/group-chat-admin.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([GroupChat, GroupChatUser, User])],
  controllers: [GroupChatController, GroupChatAdminController],
  providers: [GroupChatService, GroupChatUserService, GroupChatAdminService],
  exports: [GroupChatService, GroupChatUserService],
})
export class GroupChatModule {}
