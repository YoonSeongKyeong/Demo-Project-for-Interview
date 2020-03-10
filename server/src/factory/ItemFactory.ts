import { getRepository } from 'typeorm';
import { CreateItemEntity } from '../interface/serversideSpecific';
import { Item } from '../entity/Item';

export const createItem = async (item: CreateItemEntity): Promise<Item> =>
  await getRepository(Item).save(item);
