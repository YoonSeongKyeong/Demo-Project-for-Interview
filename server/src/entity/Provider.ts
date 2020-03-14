import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './Item';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number; // 공급자 id

  @Column()
  name: string; // 공급자 이름

  @OneToMany(
    type => Item,
    item => item.provider,
  )
  items: Item[];
}
