import { getRepository, Repository } from 'typeorm';
import { Purchased } from '../entity/Purchased';
import { User } from '../entity/User';
import { Item } from '../entity/Item';

export class PurchaseItemService {
  purchasedRepository: Repository<Purchased>;
  userRepository: Repository<User>;
  itemRepository: Repository<Item>;
  constructor() {
    this.purchasedRepository = getRepository(Purchased);
    this.userRepository = getRepository(User);
    this.itemRepository = getRepository(Item);
  }
}
