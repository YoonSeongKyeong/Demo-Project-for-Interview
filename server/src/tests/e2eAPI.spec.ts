/* eslint-disable @typescript-eslint/camelcase */

import request from 'supertest';
import { Connection } from 'typeorm';
import { Application } from 'express';
import * as http from 'http';
import { createServer } from '../app';
import { setConfigure, configs } from '../utils/configs';
import {
  CreateServer,
  TestSetUp_UserAuthObj,
  TokenForWish,
  ItemIdList,
  TokenForAuth,
} from '../interface/serversideSpecific';
import { prepareTestData } from '../utils/prepareTestData';
import { isConformToInterface } from '../utils/isConformToInterface';
import {
  GetItemsReq,
  GetItemsRes,
  ItemForm,
  GetMyCartRes,
  PostMyCartRes,
  PostMyCartReq,
} from '../interface/api';
import { decodeSetCookie } from '../utils/decodeSetCookie';
import { signJWTForWish } from '../utils/signJWT';
import { validateSetCookie } from '../utils/validateSetCookie';

// declare server core variables
let app: Application;
let connection: Connection;
let httpServer: http.Server; // key of closing server

let userInfo: TestSetUp_UserAuthObj;
let countOfItems: number;

const setUpRoutine = async (): Promise<void> => {
  setConfigure();
  const serverObj: CreateServer | undefined = await createServer();
  if (serverObj === undefined) {
    throw new Error('failed Server initialization');
  }
  app = serverObj.app;
  connection = serverObj.connection;
  httpServer = serverObj.httpServer;
};

const refreshRoutine = async (): Promise<void> => {
  await connection.dropDatabase();
  await connection.runMigrations();
  const preprareTestDataOutput = await prepareTestData();
  userInfo = preprareTestDataOutput.userAuthObj;
  countOfItems = preprareTestDataOutput.countOfItems;
};

const closeRoutine = async (): Promise<void> => {
  await connection.dropDatabase();
  connection.close();
  httpServer.close();
};

describe('Integration API Test: ', () => {
  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => setUpRoutine());

  // -------------------------------------------------------------------------
  // Refresh
  // -------------------------------------------------------------------------

  beforeEach(async () => refreshRoutine());

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(() => closeRoutine());

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  xdescribe('GetItems', () => {
    it('GET all named items without specified query', async () => {
      const reqBody: GetItemsReq = {};
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
        });
    });
    it('GET items with name containing the query keyword which is specified in request', async () => {
      const searchKeyword = 'SEARCH Tester';
      const reqBody: GetItemsReq = {
        q: searchKeyword,
      };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          res.body.goods.forEach((item: ItemForm) =>
            expect(item.name.indexOf(searchKeyword) !== -1).toBeTruthy(),
          ); // all item name includes the query keyword
        });
    });
    it('GET items with not specified default offset, which is equal to items with offset = 0 ', async () => {
      const offsetZero = '0';
      const reqBody: GetItemsReq = {};
      const newReqBody: GetItemsReq = { offset: offsetZero };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resBodyWithDefaultOffset = res.body;
          await request(app)
            .get('/api/items')
            .set('Content-Type', 'application/json')
            .query(newReqBody)
            .send()
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(newRes => {
              expect(isConformToInterface(newRes.body, resBody)).toBeTruthy();
              const resBodyWithZeroOffset = newRes.body;
              expect(resBodyWithDefaultOffset).toMatchObject(resBodyWithZeroOffset);
            });
        });
    });
    it('GET items with specified offset = 1, which is not equal to items with offset = 2', async () => {
      const offsetOne = '1';
      const offsetTwo = '2';
      const reqBody: GetItemsReq = { offset: offsetOne };
      const newReqBody: GetItemsReq = { offset: offsetTwo };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const itemListWithOffsetOne = res.body.goods;
          await request(app)
            .get('/api/items')
            .set('Content-Type', 'application/json')
            .query(newReqBody)
            .send()
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(newRes => {
              expect(isConformToInterface(newRes.body, resBody)).toBeTruthy();
              const itemListWithOffsetTwo = newRes.body.goods;
              expect(itemListWithOffsetOne.length).toEqual(itemListWithOffsetTwo.length);
              const len = itemListWithOffsetOne.length;
              for (let i = 0; i < len; i++) {
                expect(itemListWithOffsetOne[i].id).not.toEqual(itemListWithOffsetTwo[i].id);
              }
            });
        });
    });
    it('fails to GET items with too much offset', async () => {
      const tooMuchOffset = '' + 999999;
      const reqBody: GetItemsReq = { offset: tooMuchOffset };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods).toEqual([]);
        });
    });
    it('GET items with not specified default limit, which is equal to items with limit = 20 ', async () => {
      const reqBody: GetItemsReq = {};
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
    it('GET items with specified random limit (lmiit < 30 & limit > 0)', async () => {
      const randomLimit = Math.floor(Math.random() * 29) + 1;
      const reqBody: GetItemsReq = { limit: '' + randomLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === randomLimit).toBeTruthy();
        });
    });
    it('GET all items with Too much lmiit ', async () => {
      const tooMuchLimit = 9999999;
      const reqBody: GetItemsReq = { limit: '' + tooMuchLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length < tooMuchLimit).toBeTruthy();
        });
    });
    it('GET items with default = 20 when specified limit is invalid : limit = EmptyString', async () => {
      const invalidLimit = '';
      const reqBody: GetItemsReq = { limit: '' + invalidLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
    it('GET items with default = 20 when specified limit is invalid : limit = string', async () => {
      const invalidLimit = 'Hello World';
      const reqBody: GetItemsReq = { limit: '' + invalidLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
    it('GET items with default = 20 when specified limit is invalid : limit = 0', async () => {
      const invalidLimit = 0;
      const reqBody: GetItemsReq = { limit: '' + invalidLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
    it('GET items with default = 20 when specified limit is invalid : limit = -5', async () => {
      const invalidLimit = -5;
      const reqBody: GetItemsReq = { limit: '' + invalidLimit };
      const resBody: GetItemsRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/items')
        .set('Content-Type', 'application/json')
        .query(reqBody)
        .send()
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
  });
  xdescribe('GetMyCart', () => {
    it('Creates new Wish Cookie Responding with Empty Item List, when there is No Valid Wish Cookie in request, No Auth Cookie', async () => {
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 0).toBeTruthy(); // Empty Item List

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of filtered Items, only by Wish List in Cookie, when there is valid Wish Cookie in request: itemIdList having not registered Id, No Auth Cookie', async () => {
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          expect(unfiltereditemIdList).not.toMatchObject(resItemIdList);
          const sortedItemIdList = [
            ...unfiltereditemIdList.filter(id => id <= countOfItems && id > 0),
          ];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).not.toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 GetMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart only by Wish List in Cookie, when there is valid Wish Cookie in request, No Auth Cookie', async () => {
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          const sortedItemIdList = [...unsorteditemIdList];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Creates new Wish Cookie Responding with Empty Item List, Clearing Auth Cookie, when there is No Valid Wish Cookie in request, with Invalid Auth Cookie', async () => {
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      debugger;
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=INVALID`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 0).toBeTruthy(); // Empty Item List

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Creates new Wish Cookie Responding with Empty Item List, when there is No Valid Wish Cookie in request, with Auth Cookie of who having No Wish Info', async () => {
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=${userInfo['Valid@Lot.Cash'].auth}`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 0).toBeTruthy(); // Empty Item List

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Creates new Wish Cookie Responding with registered Wish List, when there is No Valid Wish Cookie in request, with Auth Cookie of who having Wish Info', async () => {
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=${userInfo['Valid@Test.Wish'].auth}`])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length !== 0).toBeTruthy(); // 계정에 등록된 Item List

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of filtered Items, only by Wish List in Cookie, Clearing Auth Cookie, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Invalid Auth Cookie', async () => {
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=INVALID`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          expect(unfiltereditemIdList).not.toMatchObject(resItemIdList);
          const sortedItemIdList = [
            ...unfiltereditemIdList.filter(id => id <= countOfItems && id > 0),
          ];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).not.toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 GetMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Get Cart of Items, only by Wish List in Cookie, Clearing Auth Cookie, when there is valid Wish Cookie in request, with Invalid Auth Cookie', async () => {
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=INVALID`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          const sortedItemIdList = [...unsorteditemIdList];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Get Cart of filtered Items, only by Wish List in Cookie, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Auth Cookie of who having No Wish Info', async () => {
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=${userInfo['Valid@Lot.Cash'].auth}`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          expect(unfiltereditemIdList).not.toMatchObject(resItemIdList);
          const sortedItemIdList = [
            ...unfiltereditemIdList.filter(id => id <= countOfItems && id > 0),
          ];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 GetMyCart는 wish쿠키의 itemIdList를 valid하게 만들어준다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of filtered Items, Wish List in Cookie and registered Wish List merge into one, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Auth Cookie of who having Wish Info', async () => {
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=${userInfo['Valid@Test.Wish'].auth}`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          expect(unfiltereditemIdList).not.toMatchObject(resItemIdList);
          const sortedItemIdList = [
            ...unfiltereditemIdList.filter(id => id <= countOfItems && id > 0),
          ];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).not.toMatchObject(resItemIdList);
          expect(sortedItemIdList.length).toBeLessThan(resItemIdList.length); // merge되었기 때문에 wish Cookie로 보낸 item들보다 많이 가져온다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 GetMyCart는 wish쿠키의 itemIdList를 valid하게 만들어준다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of Items, only by Wish List in Cookie, when there is valid Wish Cookie in request, with Auth Cookie of who having No Wish Info', async () => {
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=${userInfo['Valid@Lot.Cash'].auth}`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          const sortedItemIdList = [...unsorteditemIdList];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of Items, Wish List in Cookie and registered Wish List merge into one, when there is valid Wish Cookie in request, with Auth Cookie of who having Wish Info', async () => {
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const resBody: GetMyCartRes = {
        goods: [
          {
            id: 0,
            name: '',
            titleImage: '',
            price: 0,
            provider: '',
            options: [],
            shipping: { method: '', price: 0, canBundle: true },
          },
        ],
      };
      return await request(app)
        .get('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=${userInfo['Valid@Test.Wish'].auth}`,
        ])
        .send()
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          const sortedItemIdList = [...unsorteditemIdList];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).not.toMatchObject(resItemIdList);
          expect(sortedItemIdList.length).toBeLessThan(resItemIdList.length); // merge되었기 때문에 wish Cookie로 보낸 item들보다 많이 가져온다.

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 GetMyCart는 wish쿠키의 itemIdList를 valid하게 만들어준다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
  });
  describe('PostMyCarts', () => {
    it('Creates new Wish Cookie Responding with posted Item Id List, not filtered but sorted, when there is No Valid Wish Cookie in request, No Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList];
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Add posted Item Id List to Wish Cookie, not filtered but sorted, when there is valid Wish Cookie in request: itemIdList having not registered Id, No Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unfiltereditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Add posted Item Id List to Wish Cookie, not filtered but sorted, when there is valid Wish Cookie in request, No Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unsorteditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Creates new Wish Cookie Responding with posted Item Id List, Clearing Auth Cookie, not filtered but sorted, when there is No Valid Wish Cookie in request, with Invalid Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      debugger;
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=INVALID`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList];
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Creates new Wish Cookie Responding with posted Item Id List, registering, not filtered but sorted, when there is No Valid Wish Cookie in request, with Auth Cookie of who having No Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=${userInfo['Valid@Lot.Cash'].auth}`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList];
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Creates new Wish Cookie Responding with posted Item Id List, registering, not filtered but sorted, when there is No Valid Wish Cookie in request, with Auth Cookie of who having Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [`wish=INVALID`, `auth=${userInfo['Valid@Test.Wish'].auth}`])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList];
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Add posted Item Id List to Wish Cookie, Clearing Auth Cookie, not filtered but sorted, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Invalid Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=INVALID`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unfiltereditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Add posted Item Id List to Wish Cookie, Clearing Auth Cookie, not filtered but sorted, when there is valid Wish Cookie in request, with Invalid Auth Cookie', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=INVALID`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unsorteditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth되지 못한 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
          expect(validateSetCookie({ cookieObj: cookieObj.auth, isExpired: true })).toBeTruthy(); // Clear Auth Cookie
          expect(cookieObj.auth.Payload).toEqual(undefined);
        });
    });
    it('Add posted Item Id List to Wish Cookie, not filtered but sorted, registering, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Auth Cookie of who having No Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=${userInfo['Valid@Lot.Cash'].auth}`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unfiltereditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Add posted Item Id List to Wish Cookie, not filtered but sorted, registering, when there is valid Wish Cookie in request: itemIdList having not registered Id, with Auth Cookie of who having Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`,
          `auth=${userInfo['Valid@Test.Wish'].auth}`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unfiltereditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Add posted Item Id List to Wish Cookie, not filtered but sorted, registering, when there is valid Wish Cookie in request, with Auth Cookie of who having No Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=${userInfo['Valid@Lot.Cash'].auth}`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unsorteditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    xit('Add posted Item Id List to Wish Cookie, not filtered but sorted, registering, when there is valid Wish Cookie in request, with Auth Cookie of who having Wish Info', async () => {
      const unfiltereditemIdAddList: ItemIdList = [8, 1, 2, 9988999, -51, 0, 4, 5, 7, 3, 22, 13]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const unsorteditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 countOfItem까지 Item ID가 존재한다고 가정한다.
      const resToken: TokenForWish = {
        itemIdList: [1],
      };
      const reqBody: PostMyCartReq = {
        itemIdList: unfiltereditemIdAddList,
      };
      const resBody: PostMyCartRes = {
        isSuccess: true,
      };
      return await request(app)
        .post('/api/mycart')
        .set('Content-Type', 'application/json')
        .set('Cookie', [
          `wish=${signJWTForWish({ itemIdList: unsorteditemIdList })}`,
          `auth=${userInfo['Valid@Test.Wish'].auth}`,
        ])
        .send(reqBody)
        .expect(200)
        .then(res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.isSuccess).toBeTruthy();

          const sortedItemIdList = [...unfiltereditemIdAddList]; // merge cookies : cannot filter invalid id
          unsorteditemIdList.forEach(id => {
            if (!sortedItemIdList.includes(id)) {
              sortedItemIdList.push(id);
            }
          });
          sortedItemIdList.sort((a, b) => a - b);

          // Test Cookie
          const cookieObj = decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // Auth된 상태로 PostMyCart는 wish쿠키의 itemIdList를 valid하게 만들지 못한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
  });
  xdescribe('PurchaseItems', () => {
    it('descriptive test name', async () => {
      //   const reqBody = {};
      //   return await request(app)
      //     .get('/api/~~~')
      //     .query({ reqBody: JSON.stringify(reqBody) })
      //     .set('Content-Type', 'application/json')
      //     .set('Cookie', `token=${'user-jwt'}`)
      //     .send()
      //     .expect(404)
      //     .then(async res => {
      //       // parse cookie
      //       const parseCookie = res.header['set-cookie'][0]
      //         .split(',')
      //         .map((item: string) => item.split(';')[0]);
      //       const [key] = parseCookie[0].split('=');
      //       const expiration = new Date(parseCookie[1]).getTime();
      //       expect(expiration).toBeLessThan(Date.now()); // cleared
      //       expect(key).toEqual('token');
      //     });
    });
  });
  xdescribe('DeleteMyCarts', () => {
    it('descriptive test name', async () => {
      //   const reqBody = {};
      //   return await request(app)
      //     .get('/api/~~~')
      //     .query({ reqBody: JSON.stringify(reqBody) })
      //     .set('Content-Type', 'application/json')
      //     .set('Cookie', `token=${'user-jwt'}`)
      //     .send()
      //     .expect(404)
      //     .then(async res => {
      //       // parse cookie
      //       const parseCookie = res.header['set-cookie'][0]
      //         .split(',')
      //         .map((item: string) => item.split(';')[0]);
      //       const [key] = parseCookie[0].split('=');
      //       const expiration = new Date(parseCookie[1]).getTime();
      //       expect(expiration).toBeLessThan(Date.now()); // cleared
      //       expect(key).toEqual('token');
      //     });
    });
  });
});
