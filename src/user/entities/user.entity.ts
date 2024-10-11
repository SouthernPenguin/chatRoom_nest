import { Exclude } from 'class-transformer';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
// 用户
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '用户名',
    nullable: false,
    length: 30,
    unique: true,
  })
  name: string;

  @Column({ type: 'varchar', comment: '昵称', nullable: true })
  nickname: string;

  @Column({ type: 'varchar', comment: '头像', nullable: true })
  headerImg: string;

  @Column({ type: 'varchar', comment: '密码', nullable: false, length: 50 })
  @Exclude()
  password: string;

  @Column({ type: 'int', comment: '性别', nullable: true })
  gender: number;

  @ManyToMany(() => GroupChat, (groupChat) => groupChat.users)
  groupChats: GroupChat[];

  // @OneToMany(() => GroupChatUser, (userBusinessLine) => userBusinessLine.user)
  // groupChatUser: GroupChatUser[];
}
