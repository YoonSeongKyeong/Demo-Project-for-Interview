import { getRepository } from 'typeorm';
import { CreateOptionEntity } from '../interface/serversideSpecific';
import { Option } from '../entity/Option';

export const createOption = async (option: CreateOptionEntity): Promise<Option> =>
  await getRepository(Option).save(option);
