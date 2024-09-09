import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';
/**
 * 系统用户
 */
@Entity()
export class SystemUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '账号', unique: true })
  name: string;

  @Column({ comment: '密码' })
  @Exclude()
  password: string;

  @ManyToMany(() => Role, (role) => role.systemUsers)
  @JoinTable({
    name: 'systemUser_role',
  })
  roles: Role[];
}
