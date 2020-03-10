import { getRepository } from 'typeorm';
import { CreateWishEntity } from '../interface/serversideSpecific';
import { Wish } from '../entity/Wish';

export const createWish = async (wish: CreateWishEntity): Promise<Wish> =>
  await getRepository(Wish).save(wish);
