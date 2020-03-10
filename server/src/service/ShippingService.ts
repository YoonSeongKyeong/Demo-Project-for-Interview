import { getRepository, Repository } from 'typeorm';
import { Shipping } from '../entity/Shipping';

export class ShippingService {
  shippingRepository: Repository<Shipping>;
  constructor() {
    this.shippingRepository = getRepository(Shipping);
  }
}
