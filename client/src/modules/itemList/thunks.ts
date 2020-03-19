import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { ActionType } from 'typesafe-actions';
import { addItemToWishListAsync, getMoreItemsAsync, searchItemsAsync } from '.';
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
    dispatch(request(undefined, null));
    try {
      await postItemIdToWishList(itemId);
      dispatch(success(undefined, null));
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
    debugger;
    let { query, page, limit } = getState().itemList as ItemListState;
    if (page === -1) {
      // 이미 items를 전부 받아온 상태를 page = -1로 정의하고 page가 -1일 때는 요청을 더 하지 않는다.
      return;
    }
    const { request, success, failure } = getMoreItemsAsync;
    dispatch(request(undefined, undefined));
    try {
      debugger;
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

export function searchItemsThunk(
  query: string
): ThunkAction<
  Promise<void>,
  RootState,
  null,
  ActionType<typeof searchItemsAsync>
> {
  return async (dispatch, getState) => {
    let { limit } = getState().itemList as ItemListState;
    const { request, success, failure } = searchItemsAsync;
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
