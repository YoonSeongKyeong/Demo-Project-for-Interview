import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Provider } from './Provider';
import { Shipping } from './Shipping';
import { Option } from './Option';
import { Purchased } from './Purchased';
import { Wish } from './Wish';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number; // 상품 id

  @Column()
  name: string; // 상품 이름

  @Column({ type: 'blob' })
  titleImage: string; // 상품 대표 이미지

  @Column()
  price: number; // 상품 가격

  @ManyToOne(
    type => Provider,
    provider => provider.items,
  )
  provider: Provider;

  @OneToOne(
    type => Shipping,
    shipping => shipping.item,
  )
  shipping: Shipping;

  @OneToMany(
    type => Option,
    option => option.item,
  )
  options: Option[];

  @OneToMany(
    type => Purchased,
    purchased => purchased.item,
  )
  purchasedList: Purchased[];

  @OneToMany(
    type => Wish,
    wish => wish.item,
  )
  wishList: Wish[];
}
