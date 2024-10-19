import { FriendShipEnum } from 'src/enum';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

// 好友关系列表
@Entity()
@Index(['userId', 'friendId', 'sortedKey'], { unique: true })
export class FriendShip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '自己id' })
  userId: number;

  @Column({ type: 'int', nullable: true, comment: '对方id' })
  friendId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '自己id + 对方id',
  })
  sortedKey: string;

  @Column({
    comment: '好友状态',
    type: 'enum',
    enum: FriendShipEnum,
    default: FriendShipEnum.发起,
  })
  state: FriendShipEnum;

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

  // @Column({
  //   type: 'int',
  //   comment: '接收者(ID)',
  //   name: 'toUserId',
  //   nullable: true,
  // })
  // toUserId: number;
  // // 外键
  // @ManyToOne(() => User, user => user.id, { eager: true })
  // @JoinColumn({ name: 'toUserId' })
  // toUser: User;

  @Column({ type: 'varchar', nullable: true, comment: '备注' })
  notes: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: '自己发送给对方，对方未读信息数量',
  })
  userMsgNumber: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '对方发给我，我这边未读信息数量',
  })
  friendMsgNumber: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date;
}
