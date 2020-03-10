import { Request, Response } from 'express';
import { DeleteMyCartReq, DeleteMyCartRes } from '../interface/api';

// 장바구니 삭제

export async function deleteMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: DeleteMyCartReq;
  let resBody: DeleteMyCartRes;

  // 기본적으로 장바구니 토큰에서 삭제 요청된 상품들을 지운다.
  // 로그인이 되어 있다면, Wish 목록에서 삭제 요청된 상품들을 지운다.
  try {
    const { itemIdList } = request.body; // interface 외의 정보 제거
    reqBody = { itemIdList };
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
