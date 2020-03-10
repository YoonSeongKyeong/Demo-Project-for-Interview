import { Request, Response } from 'express';
import { configs } from '../utils/configs';
import { PurchaseItemReq, PurchaseItemRes } from '../interface/api';
import { TokenForJWT } from '../interface/serversideSpecific';
import * as jwt from 'jsonwebtoken';

// 상품들 구매

export async function purchaseItems(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: PurchaseItemReq;
  let resBody: PurchaseItemRes;

  let token: TokenForJWT;

  try {
    const { goods } = request.body; // interface 외의 정보 제거
    reqBody = { goods };

    // 상품들을 구매하기 전에, 재고가 남아있는지 확인하고, 배송비 및 가격을 계산한 후
    // <Purchased에 상품들을 등록하면서, 각 상품들의 재고에서 사려는 개수만큼 뺀다. 또 가격을 유저의 cash에서 뺀다.> === Transaction
    // 재고가 없거나 cash가 없다면 구매가 실패한다.
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
