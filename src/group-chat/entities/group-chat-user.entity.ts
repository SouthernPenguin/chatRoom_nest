import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GroupChatUser {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  groupChatId: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'boolean', nullable: true, comment: '是否禁言', default: 0 })
  isSpeak: boolean;

  @Column({ type: 'int', nullable: true, comment: '消息数量' })
  msgNumber: number;

  @Column({ type: 'timestamp', nullable: true, comment: '进入聊天室时间' })
  enterTime: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '离开聊天室时间' })
  exitTime: Date;
}
