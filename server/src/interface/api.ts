/* eslint-disable @typescript-eslint/camelcase */
// 서버 API와 관련된 interface를 모아둡니다.
import {
  Item_Dependency,
  Option_Dependency,
  Shipping_Dependency,
  Wish_Dependency,
  Purchased_Dependency,
} from './dependency';

export interface GetItemsReq extends Item_Dependency {
  q: string;
  offset: string;
  limit: string;
}

export interface Options extends Option_Dependency {
  id: number;
  color: string;
  size: string;
  stock: number;
}

export interface Shipping extends Shipping_Dependency {
  method: string;
  price: number;
  canBundle: boolean;
}

export interface ItemForm extends Item_Dependency {
  id: number;
  name: string;
  provider: string;
  price: number;
  options: Options[];
  shipping: Shipping;
}

export interface GetItemsRes {
  goods: ItemForm[];
}

export interface GetMyCartRes {
  goods: ItemForm[];
}

export interface PurchaseItemReq extends Purchased_Dependency {
  goods: ItemForm[];
}

export interface PurchaseItemRes extends Item_Dependency, Purchased_Dependency {
  isSuccess: boolean;
  price: number;
}

export interface PostMyCartReq extends Item_Dependency, Wish_Dependency {
  itemIdList: string[];
}

export interface PostMyCartRes extends Wish_Dependency {
  isSuccess: boolean;
}
export interface DeleteMyCartReq extends Item_Dependency, Wish_Dependency {
  itemIdList: string[];
}

export interface DeleteMyCartRes extends Wish_Dependency {
  isSuccess: boolean;
}
