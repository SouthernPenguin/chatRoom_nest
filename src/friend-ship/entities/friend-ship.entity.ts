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

  @Column({ type: 'boolean', default: true })
  state: boolean;
}
