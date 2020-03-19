import { ItemForm } from '../../interface/api';
import { createReducer } from 'typesafe-actions';
import { ItemListAction } from './actions';
import {
  GET_MORE_ITEMS,
  GET_MORE_ITEMS_SUCCESS,
  GET_MORE_ITEMS_ERROR,
  ADD_ITEM_TO_WISHLIST,
  ADD_ITEM_TO_WISHLIST_SUCCESS,
  ADD_ITEM_TO_WISHLIST_ERROR,
  SEARCH_ITEMS,
  SEARCH_ITEMS_SUCCESS,
  SEARCH_ITEMS_ERROR,
} from './types';

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
export type ItemListState = {
  requestStatus: {
    // OK | LOADING | ERROR
    ADD_ITEM_TO_WISHLIST: string;
    GET_MORE_ITEMS: string;
    SEARCH_ITEMS: string;
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
    SEARCH_ITEMS: 'OK',
  },
  items: [],
  query: '',
  page: 0,
  limit: 20,
};

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
const itemList = createReducer<ItemListState, ItemListAction>(initialState, {
  [ADD_ITEM_TO_WISHLIST]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      ADD_ITEM_TO_WISHLIST: 'LOADING',
    },
  }),
  [ADD_ITEM_TO_WISHLIST_SUCCESS]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      ADD_ITEM_TO_WISHLIST: 'OK',
    },
  }),
  [ADD_ITEM_TO_WISHLIST_ERROR]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      ADD_ITEM_TO_WISHLIST: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
    },
  }),
  [GET_MORE_ITEMS]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      GET_MORE_ITEMS: 'LOADING',
    },
  }),
  [GET_MORE_ITEMS_SUCCESS]: (state, action) => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      GET_MORE_ITEMS: 'OK',
    },
    items: [...state.items, ...action.payload],
    page: action.payload.length !== 0 ? state.page + 1 : -1,
    // 이미 items를 전부 받아온 상태를 page = -1로 정의하고 page가 -1일 때는 요청을 더 하지 않는다.
  }),
  [GET_MORE_ITEMS_ERROR]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      GET_MORE_ITEMS: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
    },
  }),
  [SEARCH_ITEMS]: (state, action) => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      SEARCH_ITEMS: 'LOADING',
    },
    query: action.payload,
    items: [],
  }),
  [SEARCH_ITEMS_SUCCESS]: (state, action) => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      SEARCH_ITEMS: 'OK',
    },
    items: [...(action.payload as ItemForm[])], // 새로 검색한 아이템들로 채운다.
    page: action.payload.length !== 0 ? 0 : -1,
    // 이미 items를 전부 받아온 상태를 page = -1로 정의하고 page가 -1일 때는 요청을 더 하지 않는다.
  }),
  [SEARCH_ITEMS_ERROR]: state => ({
    ...state,
    requestStatus: {
      ...state.requestStatus,
      SEARCH_ITEMS: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
    },
  }),
});

export default itemList;
