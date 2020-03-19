import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { isMatch } from '../utils/encryptions';
import { SignInReq } from 'src/interface/api';
import { TokenForAuth } from 'src/interface/serversideSpecific';

export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  isValidUser = async (userId: number): Promise<boolean> => {
    const user = await this.userRepository.findOne({ id: userId });
    return user !== undefined;
  };
  signIn = async ({ email, password }: SignInReq): Promise<TokenForAuth> => {
    const user = await this.userRepository.findOne({ email });
    if (!!user && (await isMatch(password, user.password))) {
      return { id: user.id };
    }
    throw new Error('Invalid SignIn Info');
  };
}
