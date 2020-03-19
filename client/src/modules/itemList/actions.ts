import { createAsyncAction, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { ItemForm } from '../../interface/api';
import {
  ADD_ITEM_TO_WISHLIST,
  ADD_ITEM_TO_WISHLIST_SUCCESS,
  ADD_ITEM_TO_WISHLIST_ERROR,
  GET_MORE_ITEMS,
  GET_MORE_ITEMS_SUCCESS,
  GET_MORE_ITEMS_ERROR,
  SEARCH_ITEMS,
  SEARCH_ITEMS_SUCCESS,
  SEARCH_ITEMS_ERROR,
} from './types';

// 액션 생성함수를 선언합니다
export const addItemToWishListAsync = createAsyncAction(
  ADD_ITEM_TO_WISHLIST,
  ADD_ITEM_TO_WISHLIST_SUCCESS,
  ADD_ITEM_TO_WISHLIST_ERROR
)<undefined, undefined, AxiosError>();

export const getMoreItemsAsync = createAsyncAction(
  GET_MORE_ITEMS,
  GET_MORE_ITEMS_SUCCESS,
  GET_MORE_ITEMS_ERROR
)<undefined, ItemForm[], AxiosError>();

export const searchItemsAsync = createAsyncAction(
  SEARCH_ITEMS,
  SEARCH_ITEMS_SUCCESS,
  SEARCH_ITEMS_ERROR
)<string, ItemForm[], AxiosError>();

const actions = { addItemToWishListAsync, getMoreItemsAsync, searchItemsAsync }; // 모든 액션 생성함수들을 actions 객체에 넣습니다
export type ItemListAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다
