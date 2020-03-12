import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Check } from 'typeorm';
import { Item } from './Item';

@Entity()
export class Option {
  // !ISSUE: 나중에 option별로 추가금액을 설정해줄 수 있다.
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
