import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { ActionType } from 'typesafe-actions';
import { addItemToWishListAsync, getMoreItemsAsync, searchAsync } from '.';
import { postItemIdToWishList, getItems } from '../../api/itemList';
import { ItemListState } from './reducer';

// Thunk를 만듭니다
export function addItemToWishListThunk(
  itemId: number
): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof addItemToWishListAsync>
> {
  return async dispatch => {
    const { request, success, failure } = addItemToWishListAsync;
    dispatch(request());
    try {
      await postItemIdToWishList(itemId);
      dispatch(success());
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

export function getMoreItemsThunk(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof getMoreItemsAsync>
> {
  return async (dispatch, getState) => {
    let { query, page, limit, items } = getState().itemList as ItemListState;
    if (items.length !== 0) {
      // 맨 처음이 아니라면 다음 페이지를 받아온다.
      page += 1;
    }
    const { request, success, failure } = getMoreItemsAsync;
    dispatch(request());
    try {
      const items = await getItems({
        q: query,
        offset: '' + page,
        limit: '' + limit,
      });
      dispatch(success(items));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

export function searchThunk(
  query: string
): ThunkAction<Promise<void>, RootState, null, ActionType<typeof searchAsync>> {
  return async (dispatch, getState) => {
    let { limit } = getState().itemList as ItemListState;
    const { request, success, failure } = searchAsync;
    dispatch(request(query));
    try {
      const items = await getItems({
        q: query,
        offset: '0',
        limit: '' + limit,
      });
      dispatch(success(items));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}
