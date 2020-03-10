import { getRepository, Repository } from 'typeorm';
import { Provider } from '../entity/Provider';

export class ProviderService {
  providerRepository: Repository<Provider>;
  constructor() {
    this.providerRepository = getRepository(Provider);
  }
}
