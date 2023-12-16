import { FilesSource } from 'src/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '文件类型', type: 'text', nullable: true })
  fileType: string;

  @Column({ comment: '文件路径', type: 'text', nullable: true })
  fileUrl: string;

  @Column({
    comment: '文件来源类型',
    type: 'enum',
    enum: FilesSource,
    default: FilesSource.私聊,
  })
  source: FilesSource;

  @Column({
    comment: '来源id',
    type: 'inet',
  })
  sourceId: number;
}
