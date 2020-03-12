import * as jwt from 'jsonwebtoken';
import { configs } from './configs';
import { TokenForAuth, TokenForWish } from '../interface/serversideSpecific';

export const signJWTForAuth = (token: TokenForAuth): string =>
  jwt.sign(token, configs.JWT_SECRET, {
    expiresIn: '1y',
  }); // 만료시간을 긴 시간으로 잡고 적절한 에러처리를 사용

export const signJWTForWish = (token: TokenForWish): string =>
  jwt.sign(token, configs.JWT_SECRET, {
    expiresIn: '1y',
  }); // 만료시간을 긴 시간으로 잡고 적절한 에러처리를 사용
