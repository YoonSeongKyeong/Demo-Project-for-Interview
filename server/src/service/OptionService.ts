import { getRepository, Repository } from 'typeorm';
import { Option } from '../entity/Option';

export class OptionService {
  optionRepository: Repository<Option>;
  constructor() {
    this.optionRepository = getRepository(Option);
  }
}
