import { getRepository, Repository } from 'typeorm';
import { Wish } from '../entity/Wish';

export class WishService {
  wishRepository: Repository<Wish>;
  constructor() {
    this.wishRepository = getRepository(Wish);
  }
}
