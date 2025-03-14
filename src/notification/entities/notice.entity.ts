import { ChatType, MessageEnum } from 'src/enum';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// 通知表
@Entity()
@Index(['toUserId', 'fromUserId'], { unique: true })
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '对方发给我，我这边未读信息数量',
  })
  friendMsgNumber: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '自己发送给对方，对方未读信息数量',
  })
  userMsgNumber: number;

  @Column({
    comment: '私聊=ONE_FOR_ONE 群聊=MANY_TO_MANY',
    type: 'enum',
    enum: ChatType,
    default: ChatType.私聊,
  })
  msgType: ChatType;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;

  @Column({
    comment: '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
    type: 'enum',
    enum: MessageEnum,
    default: MessageEnum.未读,
  })
  state: MessageEnum;

  @Column({
    type: 'text',
    comment: '最新的信息',
    name: 'newMessage',
    nullable: true,
  })
  newMessage: string;

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

  @Column({
    type: 'int',
    comment: '接收者(ID)',
    name: 'toUserId',
    nullable: true,
  })
  toUserId: number;
  // 外键
  @ManyToOne(() => User, user => user.id, { eager: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column({
    type: 'int',
    comment: '群id/同时是接收者id',
    name: 'groupId',
    nullable: true,
  })
  groupId: number;
  // 外键
  @ManyToOne(() => GroupChat, groupChat => groupChat.id, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  toUsers: GroupChat;
}
