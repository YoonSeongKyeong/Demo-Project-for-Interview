import { getRepository } from 'typeorm';
import { CreateProviderEntity } from '../interface/serversideSpecific';
import { Provider } from '../entity/Provider';

export const createProvider = async (provider: CreateProviderEntity): Promise<Provider> =>
  await getRepository(Provider).save(provider);
