import { MessageEnum } from 'src/enum';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 消息
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '文件类型', type: 'text', nullable: true })
  fileType: string;

  @Column({ comment: '聊天内容', type: 'text', nullable: true })
  postMessage: string;

  @Column({
    comment: '聊天记录状态：未读:UNREAD,已读 :READ,撤回:WITHDRAW,删除:DELETE',
    type: 'enum',
    enum: MessageEnum,
    default: MessageEnum.未读,
  })
  state: MessageEnum;

  @CreateDateColumn()
  createdTime: Date;

  @Column({
    type: 'int',
    comment: '发送者(ID)',
    name: 'fromUserId',
    nullable: true,
  })
  fromUserId: number;
  // 外键
  @ManyToOne(() => User, (user) => user.id, { eager: true })
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
  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  // @Column({
  //   comment: '记录谁删除信息',
  //   type: 'number',
  //   nullable: true,
  // })
  // fromUserDelId: number;
  // // 外键
  // @ManyToOne(() => User, (user) => user.id, { eager: true })
  // @JoinColumn({ name: 'fromUserDelId' })
  // fromDel: User;
}
