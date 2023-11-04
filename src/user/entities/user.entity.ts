import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名', nullable: true, length: 30, unique: true })
  name: string;

  @Column({ comment: '昵称', length: 30 })
  nickname: string;

  @Column({ comment: '头像' })
  headerImg: string;

  @Column({ comment: '密码', nullable: true, length: 50 })
  @Exclude()
  password: string;

  @Column({ comment: '性别' })
  gender: number;
}
