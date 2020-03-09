import { getRepository } from 'typeorm';
import { CreateUserEntity } from '../interface/serversideSpecific';
import { User } from '../entity/User';

export const createUser = async (user: CreateUserEntity): Promise<User> => {
  const newUser = Object.assign(new User(), user);
  await getRepository(User).save(newUser);
  return newUser;
};
