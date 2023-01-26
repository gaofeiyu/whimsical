import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

// 这里可以修改表名
@Entity()
export class Tracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text', { name: 'actionId' })
  actionId: string;

  @Column('text', { name: 'projectId' })
  projectId: string;

  @Column('text', { name: 'type' })
  type: string;

  @Column('text', { name: 'extend' })
  extend: string;
}
