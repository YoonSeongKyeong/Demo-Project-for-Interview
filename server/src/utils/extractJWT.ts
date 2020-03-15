/* eslint-disable @typescript-eslint/camelcase */
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { configs } from './configs';
import { TokenForAuth, TokenForWish } from '../interface/serversideSpecific';

export const extractJWT = (tokenName: string, req: Request): TokenForAuth | TokenForWish => {
  const token = req.cookies[tokenName];
  if (token !== undefined) {
    try {
      const decoded = jwt.verify(token, configs.JWT_SECRET as string);
      if (tokenName === 'auth') {
        return decoded as TokenForAuth;
      } else if (tokenName === 'wish') {
        return decoded as TokenForWish;
      }
      throw new Error(`Invalid Token Name [${tokenName}]`);
    } catch (err) {
      throw new Error(`Invalid Token [${tokenName}]`);
    }
  }
  throw new Error(`cannot find token in cookie [${tokenName}]`);
};

export const extractJWTForTest = (
  tokenName: string,
  token: string,
): TokenForAuth | TokenForWish => {
  if (token !== undefined) {
    try {
      const decoded = jwt.verify(token, configs.JWT_SECRET as string);
      if (tokenName === 'auth') {
        return decoded as TokenForAuth;
      } else if (tokenName === 'wish') {
        return decoded as TokenForWish;
      }
      throw new Error(`Invalid Token Name [${tokenName}]`);
    } catch (err) {
      throw new Error(`Invalid Token [${tokenName}]`);
    }
  }
  throw new Error(`cannot find token in cookie [${tokenName}]`);
};
