import { Request, Response } from 'express';
import { DeleteMyCartReq, DeleteMyCartRes } from '../interface/api';
import { TokenForWish, TokenForAuth, ItemIdList } from '../interface/serversideSpecific';
import { UserService } from '../service/UserService';
import { WishService } from '../service/WishService';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { signJWTForWish } from '../utils/signJWT';

// 장바구니 삭제

export async function deleteMyCart(request: Request, response: Response): Promise<void> {
  const reqBody: DeleteMyCartReq = { itemIdList: request.body.itemIdList }; // interface 외의 정보 제거
  let resBody: DeleteMyCartRes;

  let itemIdList: ItemIdList = [];

  try {
    // 쿠키의 장바구니 정보 확인
    const wish = extractJWT('wish', request) as TokenForWish;
    itemIdList = wish.itemIdList;
  } catch (error) {
    if (
      error.message === 'Invalid Token [wish]' ||
      error.message === 'Invalid Token Name [wish]' ||
      error.message === 'cannot find token in cookie [wish]'
    ) {
      // 장바구니 정보가 없는 경우 빈 배열을 사용한다.
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
      return;
    }
  } finally {
    // itemIdList에서 삭제 요청된 itemIdList를 지운다.
    itemIdList = itemIdList.filter(id => !reqBody.itemIdList.includes(id));
    try {
      // 로그인 정보를 받아온다.
      const auth = extractJWT('auth', request) as TokenForAuth;
      const { id } = auth;

      const userService = new UserService();
      const wishService = new WishService();

      if (id && (await userService.isValidUser(id))) {
        // 로그인이 되어 있다면, Wish 목록에서 삭제 요청된 상품들을 지운다.
        await wishService.deleteItemIdListOfUser({ itemIdList: reqBody.itemIdList, userId: id });
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
          response.clearCookie('auth', {
            httpOnly: true,
            domain: configs.CLIENT_DOMAIN,
            path: '/',
          });
        }
      } else {
        console.log('ERROR: ' + error.message);
        response.status(500).send(error.message);
        return;
      }
    } finally {
      // 쿠키의 장바구니를 업데이트한다.
      itemIdList.sort((a, b) => a - b); // 오름차순 보장
      response.cookie('wish', signJWTForWish({ itemIdList }), {
        expires: new Date(Date.now() + 900000000000),
        httpOnly: true,
        domain: configs.CLIENT_DOMAIN,
        path: '/',
      });
      resBody = { isSuccess: true };
      response.status(200).json(resBody);
    }
  }
}
