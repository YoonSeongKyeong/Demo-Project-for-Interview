import { Request, Response } from 'express';
import { PurchaseItemReq, PurchaseItemRes } from '../interface/api';
import { TokenForAuth } from '../interface/serversideSpecific';
import { PurchaseItemService } from '../service/purchaseItemService';
import { UserService } from '../service/UserService';
import { extractJWT } from '../utils/extractJWT';
import { configs } from 'src/utils/configs';
// 상품들 구매

export async function purchaseItems(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: PurchaseItemReq;
  let resBody: PurchaseItemRes;

  try {
    const auth = (await extractJWT('auth', request)) as TokenForAuth;
    const { id } = auth;

    const { goods } = request.body; // interface 외의 정보 제거
    reqBody = { goods };

    const userService = new UserService();
    const purchaseItemService = new PurchaseItemService();

    if (id && userService.isValidUser()) {
      // 상품들을 구매하기 전에, 재고가 남아있는지 확인하고, 배송비 및 가격을 계산한 후
      // <Purchased에 상품들을 등록하면서, 각 상품들의 재고에서 사려는 개수만큼 뺀다. 또 가격을 유저의 cash에서 뺀다.> === Transaction
      // 재고가 없거나 cash가 없다면 구매가 실패한다.

      purchaseItemService.purchaseByItemFormListAndUserId(reqBody.goods, id);
    } else {
      throw new Error('Invalid Id');
    }
  } catch (error) {
    if (
      error.message === 'Invalid Token Name [auth]' ||
      error.message === 'cannot find token in cookie [auth]' ||
      error.message === 'Invalid Id'
    ) {
      // 유저 정보가 없는 경우
      if (error.message === 'Invalid Id') {
        // id가 유효하지 않은 경우, Clear Cookie
        response.clearCookie('auth', { domain: configs.CLIENT_DOMAIN, path: '/' });
      }
      resBody = { isSuccess: false, price: 0 }; // 요청 실패 전송
      response.status(401).json(resBody);
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
    }
  }
}
