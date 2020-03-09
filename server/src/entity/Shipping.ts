import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Item } from './Item';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number; // 배송방식 id

  @Column()
  method: string; // 배송방식

  @Column()
  price: number; // 배송비용

  @Column()
  canBundle: boolean; // 같이배송가능 여부

  @OneToOne(
    type => Item,
    item => item.shipping,
  )
  @JoinColumn()
  item: Item;
}
