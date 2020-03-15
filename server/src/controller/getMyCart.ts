import { Request, Response } from 'express';
import { GetMyCartRes, ItemForm } from '../interface/api';
import { UserService } from '../service/UserService';
import { ItemService } from '../service/ItemService';
import { WishService } from '../service/WishService';
import { TokenForAuth, TokenForWish, ItemIdList } from 'src/interface/serversideSpecific';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { signJWTForWish } from '../utils/signJWT';

// 장바구니 불러오기

export async function getMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let resBody: GetMyCartRes;

  const userService = new UserService();
  const wishService = new WishService();
  const itemService = new ItemService();

  let goods: ItemForm[] = [];
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
    try {
      // 로그인 정보 확인
      const auth = extractJWT('auth', request) as TokenForAuth;
      const { id } = auth;

      if (id && (await userService.isValidUser(id))) {
        // 로그인이 된 상황이라면 자신의 Wish에 장바구니 토큰의 목록을 동기화한 후 Wish목록의 상품들을 가져온다.
        itemIdList = await wishService.addItemIdListOfUserReturnsValidOne({
          itemIdList,
          userId: id,
        }); // valid한 상품의 itemIdList를 return한다. local장바구니->유저 wish DB 는 가능하지만, 유저 wish DB -> local장바구니 불가능 (보안 및 사생활 보호)
        goods = await itemService.getItemFormListByItemIdList(
          await wishService.getItemIdListOfUser({ userId: id }),
        );
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
          response.clearCookie('auth', { domain: configs.CLIENT_DOMAIN, path: '/' });
        }
        // 장바구니 토큰만을 가지고 상품을 가져온다.
        goods = await itemService.getItemFormListByItemIdList(itemIdList);
      } else {
        console.log('ERROR: ' + error.message);
        response.status(500).send(error.message);
        return;
      }
    } finally {
      // 쿠키의 장바구니를 업데이트한다.
      itemIdList.sort((a, b) => a - b); // 오름차순 보장
      resBody = { goods };
      response
        .cookie('wish', signJWTForWish({ itemIdList }), {
          expires: new Date(Date.now() + 900000000000),
          httpOnly: true,
          domain: configs.CLIENT_DOMAIN,
          path: '/',
        })
        .status(200)
        .json(resBody);
    }
  }
}
