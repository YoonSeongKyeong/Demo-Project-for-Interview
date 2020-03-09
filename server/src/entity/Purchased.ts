import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Purchased {
  @CreateDateColumn()
  purchasedAt: Date; // 구매한 시각

  @Column()
  status: string; // 상품 상태

  @Column()
  optionLog: string; // 선택옵션 json

  @Column()
  shippingLog: string; // 선택배송방식 json

  @Column()
  sellerId: number; // 공급자 id

  @ManyToOne(
    type => User,
    user => user.purchasedList,
  )
  user: User;

  @ManyToOne(
    type => Item,
    item => item.purchasedList,
  )
  item: Item;
}
