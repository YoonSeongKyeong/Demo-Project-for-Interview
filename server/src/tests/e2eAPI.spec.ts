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
} from '../interface/serversideSpecific';
import { prepareTestData } from '../utils/prepareTestData';
import { isConformToInterface } from '../utils/isConformToInterface';
import { GetItemsReq, GetItemsRes, ItemForm, GetMyCartRes } from '../interface/api';
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
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
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 20).toBeTruthy();
        });
    });
  });
  describe('GetMyCart', () => {
    it('Creates new Wish Cookie, when there is No Valid Wish Cookie in request, No Auth Cookie', async () => {
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
        .set('Cookie', `wish=INVALID`)
        .send()
        .expect(200)
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 0).toBeTruthy(); // Empty resBody

          // Test Cookie
          const cookieObj = await decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart only by Wish List in Cookie, when there is valid Wish Cookie in request, No Auth Cookie', async () => {
      const unordereditemIdList: ItemIdList = [1, 2, 4, 10, 5, 3, 9]; // 1부터 41까지 Item ID가 존재한다고 가정한다.
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
        .set('Cookie', `wish=${signJWTForWish({ itemIdList: unordereditemIdList })}`)
        .send()
        .expect(200)
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          const sortedItemIdList = [...unordereditemIdList];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = await decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).toMatchObject(sortedItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Get Cart of filtered Items, only by Wish List in Cookie, when there is valid Wish Cookie in request: itemIdList having not registered Id, No Auth Cookie', async () => {
      const unfiltereditemIdList: ItemIdList = [1, 2, -51, 4, 10, 5, 3, 9, -3, 0, 99999999, -7]; // 1부터 41까지 Item ID가 존재한다고 가정한다.
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
        .set('Cookie', `wish=${signJWTForWish({ itemIdList: unfiltereditemIdList })}`)
        .send()
        .expect(200)
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          const resItemIdList = res.body.goods.map((item: ItemForm) => item.id);
          expect(unfiltereditemIdList).not.toMatchObject(resItemIdList);
          const sortedItemIdList = [
            ...unfiltereditemIdList.filter(id => id <= countOfItems && id > 0),
          ];
          sortedItemIdList.sort((a, b) => a - b);
          expect(sortedItemIdList).toMatchObject(resItemIdList); // 응답되는 list는 항상 id 기준 오름차순을 유지한다.

          // Test Cookie
          const cookieObj = await decodeSetCookie(res.header['set-cookie']);
          const { Payload } = cookieObj.wish;
          expect(isConformToInterface(Payload, resToken)).toBeTruthy();
          const token = Payload as TokenForWish;
          expect(token.itemIdList).not.toMatchObject(sortedItemIdList); // GetMyCart는 wish쿠키의 unregistered id를 제거해주지 못한다. (registered id의 기준 x)
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
    it('Creates new Wish Cookie, when there is No Valid Wish Cookie in request, with Auth Cookie of who having No Wish Info', async () => {
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
        .set('Cookie', `wish=INVALID, auth=${userInfo['Valid@Lot.Cash'].auth}`)
        .send()
        .expect(200)
        .then(async res => {
          expect(isConformToInterface(res.body, resBody)).toBeTruthy();
          expect(res.body.goods.length === 0).toBeTruthy(); // Empty resBody

          // Test Cookie
          const cookieObj = await decodeSetCookie(res.header['set-cookie']);
          const { Payload: wishPayload } = cookieObj.wish;
          expect(isConformToInterface(wishPayload, resToken)).toBeTruthy();
          const wishToken = wishPayload as TokenForWish;
          expect(wishToken.itemIdList.length === 0).toBeTruthy(); // Create New Empty Wish List
          expect(validateSetCookie({ cookieObj: cookieObj.wish, isExpired: false })).toBeTruthy();
        });
    });
  });
  xdescribe('PostMyCarts', () => {
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
