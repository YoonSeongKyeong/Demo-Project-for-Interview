import { Request, Response } from 'express';
import { configs } from '../utils/configs';
import { GetMyCartRes } from '../interface/api';
import { TokenForJWT } from '../interface/serversideSpecific';
import * as jwt from 'jsonwebtoken';

// 장바구니 불러오기

export async function getMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let resBody: GetMyCartRes;

  let token: TokenForJWT;

  try {
    // 기본적으로 장바구니 토큰을 가지고 상품을 가져온다.
    // 만약 로그인이 된 상황이라면 자신의 Wish에 장바구니 토큰의 목록을 동기화한 후 Wish목록의 상품들을 가져온다.
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
