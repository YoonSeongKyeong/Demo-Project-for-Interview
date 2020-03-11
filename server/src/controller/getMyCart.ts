import { Request, Response } from 'express';
import { GetMyCartRes, ItemForm } from '../interface/api';
import { UserService } from '../service/UserService';
import { ItemService } from '../service/ItemService';
import { WishService } from '../service/WishService';
import { TokenForAuth, TokenForWish } from 'src/interface/serversideSpecific';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { signJWT } from '../utils/signJWT';

// 장바구니 불러오기

export async function getMyCart(request: Request, response: Response): Promise<void> {
  debugger;
  let resBody: GetMyCartRes;

  const userService = new UserService();
  const wishService = new WishService();
  const itemService = new ItemService();

  let goods: ItemForm[];
  try {
    const auth = (await extractJWT('auth', request)) as TokenForAuth;
    const { id } = auth;
    const wish = (await extractJWT('wish', request)) as TokenForWish;
    const { itemIdList } = wish;

    if (id && (await userService.isValidUser(id))) {
      // 만약 로그인이 된 상황이라면 자신의 Wish에 장바구니 토큰의 목록을 동기화한 후 Wish목록의 상품들을 가져온다.
      await wishService.addItemIdListOfUser(itemIdList, id);
      goods = await itemService.getItemFormListByItemIdList(
        await wishService.getItemIdListOfUser(id),
      );
      resBody = { goods };
      response.status(200).json(resBody);
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
      // 기본적으로 장바구니 토큰을 가지고 상품을 가져온다.
      goods = await itemService.getItemFormListByItemIdList(itemIdList);
      resBody = { goods };
      response.status(200).json(resBody);
    } else if (
      error.message === 'Invalid Token Name [wish]' ||
      error.message === 'cannot find token in cookie [wish]'
    ) {
      // 장바구니 정보가 없는 경우 새로 만들어준다.
      goods = [];
      const itemIdList: string[] = [];
      response.cookie('wish', signJWT({ itemIdList }), {
        expires: new Date(Date.now() + 900000000000),
        httpOnly: true,
        domain: configs.CLIENT_DOMAIN,
        path: '/',
      });
      resBody = { goods };
      response.status(200).json(resBody);
    } else {
      console.log('ERROR: ' + error.message);
      response.status(500).send(error.message);
    }
  }
}
