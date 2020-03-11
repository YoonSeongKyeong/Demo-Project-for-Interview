import { Request, Response } from 'express';
import { DeleteMyCartReq, DeleteMyCartRes } from '../interface/api';
import { TokenForWish, TokenForAuth } from '../interface/serversideSpecific';
import { UserService } from '../service/UserService';
import { WishService } from '../service/WishService';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { signJWT } from '../utils/signJWT';

// 장바구니 삭제

export async function deleteMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: DeleteMyCartReq;
  let resBody: DeleteMyCartRes;

  const { itemIdList } = request.body; // interface 외의 정보 제거
  // eslint-disable-next-line prefer-const
  reqBody = { itemIdList };

  try {
    const wish = (await extractJWT('wish', request)) as TokenForWish;
    const { itemIdList } = wish;

    try {
      const auth = (await extractJWT('auth', request)) as TokenForAuth;
      const { id } = auth;

      const userService = new UserService();
      const wishService = new WishService();

      if (id && userService.isValidUser()) {
        // 로그인이 되어 있다면, Wish 목록에서 삭제 요청된 상품들을 지운다.
        await wishService.deleteItemIdListOfUser(itemIdList, id);
        // 기본적으로 장바구니 토큰에서 삭제 요청된 상품들을 지운다.
        reqBody.itemIdList.forEach(id => {
          // 현재는 장바구니에 추가하는 상품 수가 별로 없어서 O(N^2) 알고리즘을 쓰지만, 만약 scalability가 필요하다면, 오름차순을 유지하며 binarysearch로 O(NlgN)만에 처리할 수 있다. or 두 배열을 병합한 뒤 sort하고 중복된 것을 제외하고 넣어도 O(NlgN)
          if (itemIdList.includes(id)) {
            itemIdList.splice(itemIdList.indexOf(id), 1);
          }
        });
        response.cookie('wish', signJWT({ itemIdList }), {
          expires: new Date(Date.now() + 900000000000),
          httpOnly: true,
          domain: configs.CLIENT_DOMAIN,
          path: '/',
        });
        resBody = { isSuccess: true };
        response.status(200).json(resBody);
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
        // 기본적으로 장바구니 토큰에서 삭제 요청된 상품들을 지운다.
        reqBody.itemIdList.forEach(id => {
          // 현재는 장바구니에 추가하는 상품 수가 별로 없어서 O(N^2) 알고리즘을 쓰지만, 만약 scalability가 필요하다면, 오름차순을 유지하며 binarysearch로 O(NlgN)만에 처리할 수 있다. or 두 배열을 병합한 뒤 sort하고 중복된 것을 제외하고 넣어도 O(NlgN)
          if (itemIdList.includes(id)) {
            itemIdList.splice(itemIdList.indexOf(id), 1);
          }
        });
        response.cookie('wish', signJWT({ itemIdList }), {
          expires: new Date(Date.now() + 900000000000),
          httpOnly: true,
          domain: configs.CLIENT_DOMAIN,
          path: '/',
        });
        resBody = { isSuccess: true };
        response.status(200).json(resBody);
      } else {
        console.log('ERROR: ' + error.message);
        response.status(500).send(error.message);
      }
    }
  } catch (error) {
    if (
      error.message === 'Invalid Token Name [wish]' ||
      error.message === 'cannot find token in cookie [wish]'
    ) {
      // 장바구니 정보가 없는 경우 새로 만들어준다.
      response.cookie('wish', signJWT([]), {
        expires: new Date(Date.now() + 900000000000),
        httpOnly: true,
        domain: configs.CLIENT_DOMAIN,
        path: '/',
      });
      resBody = { isSuccess: true };
      response.status(200).json(resBody);
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
    }
  }
}
