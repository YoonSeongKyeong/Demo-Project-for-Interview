import { getRepository } from 'typeorm';
import { CreateUserEntity } from '../interface/serversideSpecific';
import { User } from '../entity/User';

export const createUser = async (user: CreateUserEntity): Promise<User> =>
  await getRepository(User).save(user);
