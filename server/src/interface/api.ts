/* eslint-disable @typescript-eslint/camelcase */
// 서버 API와 관련된 interface를 모아둡니다.
import { Item_Dependency, Option_Dependency, Shipping_Dependency } from './dependency';

export interface GetItemsReq extends Item_Dependency {
  q: string;
  offset: string;
  limit: string;
}

interface Options extends Option_Dependency {
  id: number;
  color: string;
  size: string;
  stock: number;
}

interface Shipping extends Shipping_Dependency {
  method: string;
  price: number;
  canBundle: boolean;
}

export interface ItemToGet extends Item_Dependency {
  id: 1;
  name: 'Python Hood T-Shirts';
  provider: 'StyleShare';
  price: 20000;
  options: Options[];
  shipping: Shipping;
}

export interface GetItemsRes {
  goods: ItemToGet[];
}

export interface GetMyCartReq {}

export interface GetMyCartRes {}

export interface PurchaseItemReq {}

export interface PurchaseItemRes {}

export interface PutMyCartReq {}

export interface PutMyCartRes {}
