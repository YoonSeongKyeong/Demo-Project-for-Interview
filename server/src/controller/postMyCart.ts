import { Request, Response } from 'express';
import { PostMyCartReq, PostMyCartRes } from '../interface/api';
import { TokenForAuth, TokenForWish, ItemIdList } from '../interface/serversideSpecific';
import { UserService } from '../service/UserService';
import { WishService } from '../service/WishService';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { signJWTForWish } from '../utils/signJWT';

// 장바구니 추가

export async function postMyCart(request: Request, response: Response): Promise<void> {
  const reqBody: PostMyCartReq = { itemIdList: request.body.itemIdList };
  let resBody: PostMyCartRes;

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
      // 장바구니 정보가 없는 경우 새로 만들어준다.
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
      return;
    }
  } finally {
    // itemIdList에 추가 요청된 itemIdList를 merge한다.
    reqBody.itemIdList.forEach(id => {
      // 현재는 장바구니에 추가하는 상품 수가 별로 없어서 O(N^2) 알고리즘을 쓰지만, 만약 scalability가 필요하다면, 오름차순을 유지하며 binarysearch로 O(NlgN)만에 처리할 수 있다. or 두 배열을 병합한 뒤 sort하고 중복된 것을 제외하고 넣어도 O(NlgN)
      if (!itemIdList.includes(id)) {
        itemIdList.push(id);
      }
    });
    try {
      // 로그인 정보를 받아온다.
      const auth = extractJWT('auth', request) as TokenForAuth;
      const { id } = auth;

      const userService = new UserService();
      const wishService = new WishService();

      if (id && (await userService.isValidUser(id))) {
        // 로그인이 된 상황이라면 자신의 Wish에 상품들을 추가한다.
        await wishService.addItemIdListOfUser({
          itemIdList,
          userId: id,
        });
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
        if (error.message !== 'cannot find token in cookie [auth]') {
          // id가 유효하지 않은 경우, Clear Cookie
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
