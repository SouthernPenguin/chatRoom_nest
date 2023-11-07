// 好友关系列表
import { FriendShipEnum } from 'src/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdTime: Date;
}
