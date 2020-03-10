import { getRepository, Repository } from 'typeorm';
import { Item } from '../entity/Item';

export class ItemService {
  itemRepository: Repository<Item>;
  constructor() {
    this.itemRepository = getRepository(Item);
  }
}
