import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Check } from 'typeorm';
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
  @Check(`"stock">=0`) // 음수가 아니라는 제약조건 생성
  stock: number; // 재고

  @ManyToOne(
    type => Item,
    item => item.options,
  )
  item: Item;
}
