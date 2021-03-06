import { ItemForm_Option, ItemForm } from '../../interface/api';

export const GET_ITEMS_FROM_WISHLIST = 'shoppingCart/GET_ITEMS_FROM_WISHLIST';
export const GET_ITEMS_FROM_WISHLIST_SUCCESS =
  'shoppingCart/GET_ITEMS_FROM_WISHLIST_SUCCESS';
export const GET_ITEMS_FROM_WISHLIST_ERROR =
  'shoppingCart/GET_ITEMS_FROM_WISHLIST_ERROR';
export const DELETE_ITEMS_FROM_WISHLIST =
  'shoppingCart/DELETE_ITEMS_FROM_WISHLIST';
export const DELETE_ITEMS_FROM_WISHLIST_SUCCESS =
  'shoppingCart/DELETE_ITEMS_FROM_WISHLIST_SUCCESS';
export const DELETE_ITEMS_FROM_WISHLIST_ERROR =
  'shoppingCart/DELETE_ITEMS_FROM_WISHLIST_ERROR';
export const PURCHASE_ITEMS = 'shoppingCart/PURCHASE_ITEMS';
export const PURCHASE_ITEMS_SUCCESS = 'shoppingCart/PURCHASE_ITEMS_SUCCESS';
export const PURCHASE_ITEMS_ERROR = 'shoppingCart/PURCHASE_ITEMS_ERROR';
export const ADD_OPTION_TO_PURCHASELIST =
  'shoppingCart/ADD_OPTION_TO_PURCHASELIST';
export const DELETE_OPTION_FROM_PURCHASELIST =
  'shoppingCart/DELETE_OPTION_FROM_PURCHASELIST';

export type addOptionToPurchaseListActionInput = {
  targetItem: ItemForm;
  option: ItemForm_Option;
};

export type deleteOptionFromPurchaseListActionInput = {
  itemId: number;
  optionId: number;
};
