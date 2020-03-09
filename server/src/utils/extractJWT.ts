/* eslint-disable @typescript-eslint/camelcase */
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { configs } from './configs';
import { TokenForJWT } from '../interface/serversideSpecific';

export const extractJWT = async (tokenName: string, req: Request): Promise<TokenForJWT> => {
  const token = req.cookies[tokenName];
  if (token !== undefined) {
    try {
      const decoded: TokenForJWT = jwt.verify(token, configs.JWT_SECRET as string) as TokenForJWT;
      return decoded;
    } catch (err) {
      throw err;
    }
  }
  throw new Error('cannot find token in cookie');
};

export const extractJWTForTest = async (token: string): Promise<TokenForJWT> => {
  if (token !== undefined) {
    try {
      const decoded: TokenForJWT = jwt.verify(token, configs.JWT_SECRET as string) as TokenForJWT;
      return decoded;
    } catch (err) {
      throw err;
    }
  }
  throw new Error('jwt cannot decode token');
};
