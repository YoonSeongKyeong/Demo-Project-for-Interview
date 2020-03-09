import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from './Item';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number; // 옵션 id

  @Column()
  color: string; // 색상

  @Column()
  size: string; // 사이즈

  @Column()
  stock: boolean; // 재고

  @ManyToOne(
    type => Item,
    item => item.options,
  )
  item: Item;
}
