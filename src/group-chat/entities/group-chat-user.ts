import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GroupChat } from './group-chat.entity';

@Entity()
export class GroupChatUser {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  groupChatId: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'boolean', nullable: true, comment: '是否禁言', default: 0 })
  isSpeak: boolean;

  @Column({ type: 'int', nullable: true, comment: '消息数量' })
  msgNumber: number;

  @ManyToOne(() => User, (user) => user.groupChatUser, {
    createForeignKeyConstraints: false,
  })
  user: User;

  @ManyToOne(() => GroupChat, (user) => user.groupChatUser, {
    createForeignKeyConstraints: false,
  })
  groupChat: GroupChat;
}
