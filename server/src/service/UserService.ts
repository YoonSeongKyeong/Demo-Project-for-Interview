import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  isValidUser = async (userId: number): Promise<boolean> => {
    const user = await this.userRepository.findOne({ id: userId });
    return user !== undefined;
  };
}
