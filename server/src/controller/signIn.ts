/* eslint-disable @typescript-eslint/camelcase */
// 탁송서버 API와 일관된 변수명 사용을 위해서 camelCase를 해제합니다.
import { Request, Response } from 'express';
import { configs } from '../utils/configs';
import { SignInReq, SignInRes } from '../interface/api';
import { TokenForJWT } from '../interface/serversideSpecific';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../service/UserService';

// 유저 로그인

export async function signIn(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: SignInReq;
  let resBody: SignInRes;

  let token: TokenForJWT;

  const userService = new UserService();

  try {
    const { property } = request.body; // interface 외의 정보 제거
    reqBody = { property };
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
