import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名', nullable: true, length: 30 })
  name: string;

  @Column({ comment: '密码', nullable: true, length: 12 })
  passWord: string;

  @Column({ comment: '性别' })
  gender: number;
}
