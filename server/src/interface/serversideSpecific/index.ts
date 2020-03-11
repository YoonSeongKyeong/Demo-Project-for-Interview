/* eslint-disable @typescript-eslint/camelcase */
import { Connection } from 'typeorm';
import { Application } from 'express';
import * as http from 'http';
import { Purchased } from '../../entity/Purchased';
import { Wish } from '../../entity/Wish';
import { Provider } from '../../entity/Provider';
import { Shipping } from '../../entity/Shipping';
import { Option } from '../../entity/Option';
import { Item } from '../../entity/Item';
import { User } from '../../entity/User';
import {
  Item_Dependency,
  Option_Dependency,
  Provider_Dependency,
  Purchased_Dependency,
  Shipping_Dependency,
  User_Dependency,
  Wish_Dependency,
} from '../dependency';

export interface Configs {
  LOAD_CONFIG: string; // 정상적으로 .env 파일이 로드되었는지 확인

  CLIENT_DOMAIN: string; // 클라이언트 도메인

  SERVER_PORT: string; // 서버 port

  JWT_SECRET: string; // JWT secret

  SALT_ROUND: string; // number of Rounds for generating salt

  TYPEORM_CONNECTION: string; // TYPE ORM ENV_VARIABLES
  TYPEORM_HOST: string;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
  TYPEORM_PORT: string;
  TYPEORM_SYNCHRONIZE: string;
  TYPEORM_LOGGING: string;
  TYPEORM_ENTITIES: string;
  TYPEORM_MIGRATIONS: string;
  TYPEORM_SUBSCRIBERS: string;
  TYPEORM_ENTITIES_DIR: string;
  TYPEORM_MIGRATIONS_DIR: string;
  TYPEORM_SUBSCRIBERS_DIR: string;
  TYPEORM_MIGRATIONS_RUN: string;

  [key: string]: string; // Index Signature
}

export interface CreateServer {
  connection: Connection;
  app: Application;
  httpServer: http.Server;
}

export interface CreateItemEntity extends Item_Dependency {
  name: string; // 상품 이름
  titleImage: string; // 상품 대표 이미지
  price: number; // 상품 가격
  provider: Provider;
  shippings: Shipping[];
  options: Option[];
  purchasedList?: Purchased[];
  wishList?: Wish[];
}
export interface UpdateItemEntity extends Item_Dependency {
  name?: string; // 상품 이름
  titleImage?: string; // 상품 대표 이미지
  price?: number; // 상품 가격
  provider?: Provider;
  shippings?: Shipping[];
  options?: Option[];
  purchasedList?: Purchased[];
  wishList?: Wish[];
}

export interface CreateOptionEntity extends Option_Dependency {
  color: string; // 색상
  size: string; // 사이즈
  stock: boolean; // 재고
  item: Item;
}
export interface UpdateOptionEntity extends Option_Dependency {
  color?: string; // 색상
  size?: string; // 사이즈
  stock?: boolean; // 재고
  item?: Item;
}

export interface CreateProviderEntity extends Provider_Dependency {
  name: string; // 공급자 이름
  items?: Item[];
}
export interface UpdateProviderEntity extends Provider_Dependency {
  name?: string; // 공급자 이름
  items?: Item[];
}

export interface CreatePurchasedEntity extends Purchased_Dependency {
  purchasedAt: Date; // 구매한 시각
  status: string; // 상품 상태
  optionLog: string; // 선택옵션 json
  shippingLog: string; // 선택배송방식 json
  sellerId: number; // 공급자 id
  user: User;
  item: Item;
}
export interface UpdatePurchasedEntity extends Purchased_Dependency {
  purchasedAt?: Date; // 구매한 시각
  status?: string; // 상품 상태
  optionLog?: string; // 선택옵션 json
  shippingLog?: string; // 선택배송방식 json
  sellerId?: number; // 공급자 id
  user?: User;
  item?: Item;
}

export interface CreateShippingEntity extends Shipping_Dependency {
  method: string; // 배송방식
  price: number; // 배송비용
  canBundle: boolean; // 같이배송가능 여부
  item: Item;
}
export interface UpdateShippingEntity extends Shipping_Dependency {
  method?: string; // 배송방식
  price?: number; // 배송비용
  canBundle?: boolean; // 같이배송가능 여부
  item?: Item;
}

export interface CreateUserEntity extends User_Dependency {
  name: string; // 유저 이름
  password: string; // 유저 비밀번호
  cash?: number; // 유저 충전금
  email: number; // 유저 로그인 이메일
  purchasedList?: Purchased[];
  wishList?: Wish[];
}

export interface UpdateUserEntity extends User_Dependency {
  name?: string; // 유저 이름
  password?: string; // 유저 비밀번호
  cash?: number; // 유저 충전금
  email?: number; // 유저 로그인 이메일
  purchasedList?: Purchased[];
  wishList?: Wish[];
}

export interface CreateWishEntity extends Wish_Dependency {
  user: User;
  item: Item;
}
export interface UpdateWishEntity extends Wish_Dependency {
  user?: User;
  item?: Item;
}

export interface TokenForAuth {
  id: string; // 유저 id
}

export interface TokenForWish {
  itemIdList: string[]; // 장바구니 목록의 상품 id 리스트
}