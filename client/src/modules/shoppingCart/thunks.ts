import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { ActionType } from 'typesafe-actions';
import {
  getItemsFromWishListAsync,
  deleteItemsFromWishListAsync,
  purchaseItemsAsync,
} from '.';
import { ShoppingCartState } from './reducer';
import {
  getItemsFromMyCart,
  deleteItemIdListFromWishList,
  purchaseItems,
} from '../../api/shoppingCart';

// Thunk를 만듭니다
export function getItemsFromWishListThunk(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof getItemsFromWishListAsync>
> {
  return async dispatch => {
    const { request, success, failure } = getItemsFromWishListAsync;
    dispatch(request(undefined, null));
    try {
      const items = await getItemsFromMyCart();
      dispatch(success(items));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

export function deleteItemsFromWishListThunk(
  itemIdList: number[]
): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof deleteItemsFromWishListAsync>
> {
  return async dispatch => {
    const { request, success, failure } = deleteItemsFromWishListAsync;
    dispatch(request(itemIdList)); // API 요청 전에 view에서 해당 상품들을 삭제한다.
    try {
      await deleteItemIdListFromWishList(itemIdList);
      dispatch(success(undefined, undefined));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

export function purchaseItemsThunk(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof purchaseItemsAsync>
> {
  return async (dispatch, getState) => {
    const { purchaseList } = getState().shoppingCart as ShoppingCartState;
    const { request, success, failure } = purchaseItemsAsync;
    dispatch(request(undefined, undefined));
    try {
      await purchaseItems(purchaseList);
      dispatch(success(undefined, undefined));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}
