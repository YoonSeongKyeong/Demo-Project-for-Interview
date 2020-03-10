import { getRepository } from 'typeorm';
import { CreatePurchasedEntity } from '../interface/serversideSpecific';
import { Purchased } from '../entity/Purchased';

export const createPurchased = async (purchased: CreatePurchasedEntity): Promise<Purchased> =>
  await getRepository(Purchased).save(purchased);
