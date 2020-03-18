import {
  createAsyncAction,
  ActionType,
  createReducer,
  getType,
} from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { AxiosError } from 'axios';

import { ItemForm } from '../../interface/api';
import { RootState } from '..';
import { postItemIdToWishList, getItems } from '../../api/itemList';

// 액션 생성함수를 선언합니다
export const addItemToWishListAsync = createAsyncAction(
  'itemList/ADD_ITEM_TO_WISHLIST',
  'itemList/ADD_ITEM_TO_WISHLIST_SUCCESS',
  'itemList/ADD_ITEM_TO_WISHLIST_ERROR'
)<undefined, undefined, AxiosError>();

export const getMoreItemsAsync = createAsyncAction(
  'itemList/GET_MORE_ITEMS',
  'itemList/GET_MORE_ITEMS_SUCCESS',
  'itemList/GET_MORE_ITEMS_ERROR'
)<undefined, ItemForm[], AxiosError>();

export const searchAsync = createAsyncAction(
  'itemList/SEARCH',
  'itemList/SEARCH_SUCCESS',
  'itemList/SEARCH_ERROR'
)<string, ItemForm[], AxiosError>();

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type ItemListState = {
  requestStatus: {
    // OK | LOADING | ERROR
    ADD_ITEM_TO_WISHLIST: string;
    GET_MORE_ITEMS: string;
    SEARCH: string;
  };
  items: ItemForm[]; // 상품 정보 리스트
  query: string; // 검색어
  page: number; // 페이지 번호
  limit: number; // 한 페이지 당 요청할 상품 개수
};

// 초기상태를 선언합니다.
const initialState: ItemListState = {
  requestStatus: {
    ADD_ITEM_TO_WISHLIST: 'OK',
    GET_MORE_ITEMS: 'OK',
    SEARCH: 'OK',
  },
  items: [],
  query: '',
  page: 0,
  limit: 20,
};

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

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
const itemList = createReducer(initialState)
  .handleAction(
    addItemToWishListAsync,
    (state: ItemListState, action: { type: string; payload: undefined }) => {
      const [request, success, failure] = [
        addItemToWishListAsync.request,
        addItemToWishListAsync.success,
        addItemToWishListAsync.failure,
      ].map(getType);
      switch (action.type) {
        case request:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              ADD_ITEM_TO_WISHLIST: 'LOADING',
            },
          };
        case success:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              ADD_ITEM_TO_WISHLIST: 'OK',
            },
          };
        case failure:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              ADD_ITEM_TO_WISHLIST: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
            },
          };
      }
    }
  )
  .handleAction(
    getMoreItemsAsync,
    (state: ItemListState, action: { type: string; payload: ItemForm[] }) => {
      const [request, success, failure] = [
        getMoreItemsAsync.request,
        getMoreItemsAsync.success,
        getMoreItemsAsync.failure,
      ].map(getType);
      switch (action.type) {
        case request:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              GET_MORE_ITEMS: 'LOADING',
            },
          };
        case success:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              GET_MORE_ITEMS: 'OK',
            },
            items: [...state.items, ...action.payload],
            page: state.page + 1,
          };
        case failure:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              GET_MORE_ITEMS: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
            },
          };
      }
    }
  )
  .handleAction(
    searchAsync,
    (
      state: ItemListState,
      action: { type: string; payload: ItemForm[] | string }
    ) => {
      const [request, success, failure] = [
        searchAsync.request,
        searchAsync.success,
        searchAsync.failure,
      ].map(getType);
      switch (action.type) {
        case request:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              SEARCH: 'LOADING',
            },
            query: action.payload,
          };
        case success:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              SEARCH: 'OK',
            },
            items: [...state.items, ...(action.payload as ItemForm[])],
            page: 0,
          };
        case failure:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              SEARCH: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
            },
          };
      }
    }
  );

export default itemList;
