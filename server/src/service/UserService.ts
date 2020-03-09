import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }
  serviceFunc = () => {};
}
