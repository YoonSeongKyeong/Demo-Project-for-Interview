import { getRepository, Repository } from 'typeorm';
import { Purchased } from '../entity/Purchased';

export class PurchasedService {
  purchasedRepository: Repository<Purchased>;
  constructor() {
    this.purchasedRepository = getRepository(Purchased);
  }
}
