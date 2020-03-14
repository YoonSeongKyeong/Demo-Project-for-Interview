import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Purchased extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  purchasedAt: Date; // 구매한 시각

  @Column()
  // WAITING_FOR_SHIPPING : 배송 대기중
  // GOING_HOME : 배송 진행중
  // RECIEVED : 배송 완료
  // REQUESTED_FOR_CHANGE : 교환 대기중
  // CHANGED : 교환 완료
  // REQUESTED_FOR_REFUND : 환불 대기중
  // REFUNDED : 환불 완료
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
