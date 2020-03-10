import { getRepository } from 'typeorm';
import { CreateShippingEntity } from '../interface/serversideSpecific';
import { Shipping } from '../entity/Shipping';

export const createShipping = async (shipping: CreateShippingEntity): Promise<Shipping> =>
  await getRepository(Shipping).save(shipping);
