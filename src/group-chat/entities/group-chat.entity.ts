import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupChatUser } from './group-chat-user.entity';
import { GroupMessage } from 'src/group-message/entities/group-message.entity';

// 群聊
@Entity()
export class GroupChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '群名' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '公告' })
  notice: string;

  // 创建人
  @ManyToOne(() => User, (user: User) => user.groupChats)
  @JoinColumn({ name: 'createdUserId' })
  createdUserId: User;

  @ManyToMany(() => User, (user: User) => user.groupChats)
  @JoinTable({
    name: 'group_chat_user',
  })
  users: User[];

  @OneToMany(() => GroupMessage, groupMessge => groupMessge.groupId, { cascade: ['recover'] })
  groupMessage: GroupMessage[];
  // @OneToMany(() => GroupChatUser, userBusinessLine => userBusinessLine.groupChatId, { cascade: ['recover'] })
  // groupChatUser: GroupChatUser[];
}
