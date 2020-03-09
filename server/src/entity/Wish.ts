import { Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Wish {
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
