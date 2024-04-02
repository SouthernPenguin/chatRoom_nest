import { Exclude } from 'class-transformer';
import { GroupChatUser } from 'src/group-chat/entities/group-chat-user';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// 用户
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '用户名',
    nullable: true,
    length: 30,
    unique: true,
  })
  name: string;

  @Column({ type: 'varchar', comment: '昵称', length: 30 })
  nickname: string;

  @Column({ type: 'varchar', comment: '头像' })
  headerImg: string;

  @Column({ type: 'varchar', comment: '密码', nullable: true, length: 50 })
  @Exclude()
  password: string;

  @Column({ type: 'int', comment: '性别' })
  gender: number;

  @ManyToMany(() => GroupChat, (groupChat) => groupChat.users)
  groupChats: GroupChat[];

  @OneToMany(() => GroupChatUser, (userBusinessLine) => userBusinessLine.user)
  groupChatUser: GroupChatUser[];
}
