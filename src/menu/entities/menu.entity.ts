import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '父节点', nullable: true })
  parentId: number;

  @Column({ comment: '菜单名', unique: true })
  name: string;

  @Column({ comment: '权限表示' })
  menuCode: string;

  @Column({ comment: '节点类型：0目录 1菜单 3按钮' })
  nodeType: number;

  @Column({ comment: '路由' })
  url: string;

  @Column({ comment: '组件名称', nullable: true })
  assemblyName: string;

  @Column({ comment: '组件路径', nullable: true })
  assemblyUrl: string;

  @Column({ comment: '排序', nullable: true })
  sort: number;

  @Column({ comment: '是否被删除', nullable: true })
  isDeleted: boolean;
}
