import { Request, Response } from 'express';
import { PurchaseItemReq, PurchaseItemRes } from '../interface/api';
import { TokenForAuth } from '../interface/serversideSpecific';
import { PurchaseItemService } from '../service/purchaseItemService';
import { UserService } from '../service/UserService';
import { extractJWT } from '../utils/extractJWT';
import { configs } from '../utils/configs';

// 상품들을 구매

export async function purchaseItems(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: PurchaseItemReq;
  let resBody: PurchaseItemRes;

  try {
    const auth = extractJWT('auth', request) as TokenForAuth;
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
        if (
          // 발생할 수 있는 알려진 에러 목록
          // !ISSUE: 나중에 typeORM에서 transaction 처리 실패 시 throw하는 에러도 cover해야 한다.
          error.message === 'Invalid User Id' ||
          error.message === 'Insufficient Cash' ||
          error.message === 'Invalid Item Form'
        ) {
          throw error;
        }
        console.log('ERROR: ' + error.message);
        response.status(500).send(error.message);
        return;
      }
    } else {
      throw new Error('Invalid User Id');
    }
  } catch (error) {
    if (
      error.message === 'Invalid Token [auth]' ||
      error.message === 'Invalid Token Name [auth]' ||
      error.message === 'cannot find token in cookie [auth]' ||
      error.message === 'Invalid User Id'
    ) {
      // 유저 정보가 없는 경우
      // id가 유효하지 않은 경우, Clear Cookie
      if (error.message !== 'cannot find token in cookie [auth]') {
        response.clearCookie('auth', { httpOnly: true, domain: configs.CLIENT_DOMAIN, path: '/' });
      }
      resBody = { isSuccess: false, price: 0 }; // 요청 실패 전송
      response.status(401).json(resBody);
    } else if (error.message === 'Insufficient Cash') {
      // 충전금이 부족한 경우
      resBody = { isSuccess: false, price: 0 }; // 요청 실패 전송
      response.status(402).json(resBody); // !ISSUE: 부족한 금액 알려주기 등, 나중에 response body를 더 구체화해서 에러처리를 할 필요가 있음.
    } else if (error.message === 'Invalid Item Form') {
      // 제출한 Item Form이 유효하지 않은 경우
      // !ISSUE: 나중에 어떤 부분이 유효하지 않았는지 구체적으로 알려줄 필요가 있음
      resBody = { isSuccess: false, price: 0 }; // 요청 실패 전송
      response.status(400).json(resBody);
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
    }
  }
}
