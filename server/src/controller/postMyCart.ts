import { Request, Response } from 'express';
import { configs } from '../utils/configs';
import { PostMyCartReq, PostMyCartRes } from '../interface/api';
import { TokenForJWT } from '../interface/serversideSpecific';
import * as jwt from 'jsonwebtoken';

// 장바구니 추가

export async function postMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: PostMyCartReq;
  let resBody: PostMyCartRes;

  let token: TokenForJWT;

  try {
    const { itemIdList } = request.body; // interface 외의 정보 제거
    reqBody = { itemIdList };

    // 기본적으로 장바구니 토큰에 상품들을 추가한다.
    // 만약 로그인이 된 상황이라면 자신의 Wish에 상품들을 추가한다.
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
