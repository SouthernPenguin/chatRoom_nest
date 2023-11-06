// 好友关系列表
import { FriendShipEnum } from 'src/enum';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['userId', 'friendId', 'sortedKey'], { unique: true })
export class FriendShip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'int', nullable: true })
  friendId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sortedKey: string;

  @Column({
    comment: '好友状态',
    type: 'enum',
    enum: FriendShipEnum,
    default: FriendShipEnum.发起,
  })
  state: FriendShipEnum;

  @Column({ type: 'datetime', nullable: true })
  createdTime: Date;
}
