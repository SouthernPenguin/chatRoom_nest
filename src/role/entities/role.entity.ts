import { Menu } from 'src/menu/entities/menu.entity';
import { SystemUser } from 'src/ststem-user/entities/ststem-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 *  角色
 */

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色姓名', unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date;

  @ManyToMany(() => SystemUser, (systemUser) => systemUser.roles)
  systemUsers: SystemUser[];

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'menu_role',
  })
  menus: Menu[];
}
