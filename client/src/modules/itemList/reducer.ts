import { ItemForm } from '../../interface/api';
import { createReducer, getType } from 'typesafe-actions';
import { addItemToWishListAsync, getMoreItemsAsync, searchAsync } from '.';

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
export type ItemListState = {
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
