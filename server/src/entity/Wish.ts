import { Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Wish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.wishList,
  )
  user: User;

  @ManyToOne(
    type => Item,
    item => item.wishList,
  )
  item: Item;
}
