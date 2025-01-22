import { MessageEnum } from 'src/enum';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
    type: 'enum',
    enum: MessageEnum,
    default: MessageEnum.未读,
  })
  state: MessageEnum;

  @Column({ comment: '原始文件名称', type: 'text', nullable: true })
  originalFileName: string;

  @Column({ comment: '文件类型', type: 'text', nullable: true })
  fileType: string;

  @Column({ comment: '文件大小', type: 'text', nullable: true })
  fileSize: string;

  @Column({ comment: '聊天内容', type: 'text', nullable: true })
  postMessage: string;

  @Column({
    type: 'int',
    comment: '群id/同时是接收者id',
    name: 'groupId',
    nullable: true,
  })
  groupId: number;
  // 外键
  @ManyToOne(() => GroupChat, groupChat => groupChat.id, { eager: true })
  @JoinColumn({ name: 'groupId' })
  toUsers: GroupChat;

  @Column({
    type: 'int',
    comment: '发送者(ID)',
    name: 'fromUserId',
    nullable: true,
  })
  fromUserId: number;
  // 外键
  @ManyToOne(() => User, user => user.id, { eager: true })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date;
}
