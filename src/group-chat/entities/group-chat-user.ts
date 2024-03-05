import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('group_chat_user')
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
}
