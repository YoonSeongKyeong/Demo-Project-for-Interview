import { createAsyncAction, ActionType, createAction } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { ItemForm } from '../../interface/api';
import {
  GET_ITEMS_FROM_WISHLIST,
  GET_ITEMS_FROM_WISHLIST_SUCCESS,
  GET_ITEMS_FROM_WISHLIST_ERROR,
  DELETE_ITEMS_FROM_WISHLIST,
  DELETE_ITEMS_FROM_WISHLIST_SUCCESS,
  DELETE_ITEMS_FROM_WISHLIST_ERROR,
  PURCHASE_ITEMS,
  PURCHASE_ITEMS_SUCCESS,
  PURCHASE_ITEMS_ERROR,
  ADD_OPTION_TO_PURCHASELIST,
  DELETE_OPTION_FROM_PURCHASELIST,
  addOptionToPurchaseListActionInput,
  deleteOptionFromPurchaseListActionInput,
} from './types';

// 액션 생성함수를 선언합니다
export const getItemsFromWishListAsync = createAsyncAction(
  GET_ITEMS_FROM_WISHLIST,
  GET_ITEMS_FROM_WISHLIST_SUCCESS,
  GET_ITEMS_FROM_WISHLIST_ERROR
)<undefined, ItemForm[], AxiosError>();

export const deleteItemsFromWishListAsync = createAsyncAction(
  DELETE_ITEMS_FROM_WISHLIST,
  DELETE_ITEMS_FROM_WISHLIST_SUCCESS,
  DELETE_ITEMS_FROM_WISHLIST_ERROR
)<number[], undefined, AxiosError>();

export const purchaseItemsAsync = createAsyncAction(
  PURCHASE_ITEMS,
  PURCHASE_ITEMS_SUCCESS,
  PURCHASE_ITEMS_ERROR
)<undefined, undefined, AxiosError>();

export const addOptionToPurchaseList = createAction(ADD_OPTION_TO_PURCHASELIST)<
  addOptionToPurchaseListActionInput
>();

export const deleteOptionFromPurchaseList = createAction(
  DELETE_OPTION_FROM_PURCHASELIST
)<deleteOptionFromPurchaseListActionInput>();

const actions = {
  getItemsFromWishListAsync,
  deleteItemsFromWishListAsync,
  purchaseItemsAsync,
  addOptionToPurchaseList,
  deleteOptionFromPurchaseList,
}; // 모든 액션 생성함수들을 actions 객체에 넣습니다
export type ShoppingCartAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다
