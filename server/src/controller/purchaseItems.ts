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

    if (id && (await userService.isValidUser(id))) {
      // 유효한 유저의 id임이 확인되면 구매 프로세스를 진행한다.
      try {
        resBody = await purchaseItemService.purchaseByItemFormListAndUserId({
          itemFormList: reqBody.goods,
          userId: id,
        });
        response.status(200).json(resBody);
      } catch (error) {
        // 구매 진행중 발생한 에러를 처리한다.
        console.log('ERROR: ' + error.message);
        response.status(500).send(error.message);
      }
    } else {
      throw new Error('Invalid User Id');
    }
  } catch (error) {
    if (
      error.message === 'Invalid Token Name [auth]' ||
      error.message === 'cannot find token in cookie [auth]' ||
      error.message === 'Invalid User Id'
    ) {
      // 유저 정보가 없는 경우
      if (error.message === 'Invalid User Id') {
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
