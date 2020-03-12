import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Wish {
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
