import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { ItemForm } from '../../interface/api';

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
