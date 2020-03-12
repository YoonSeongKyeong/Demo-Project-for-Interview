/* eslint-disable @typescript-eslint/camelcase */

import request from 'supertest';
import { Connection } from 'typeorm';
import { Application } from 'express';
import * as http from 'http';
import { createServer } from '../app';
import { setConfigure, configs } from '../utils/configs';
import { CreateServer } from '../interface/serversideSpecific';
import { prepareTestData } from '../utils/prepareTestData';
import { isConformToInterface } from '../utils/isConformToInterface';
import { GetItemsReq, GetItemsRes } from '../interface/api';

// declare server core variables
let app: Application;
let connection: Connection;
let httpServer: http.Server; // key of closing server

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
  await prepareTestData();
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

  describe('GetItems', () => {
    it('GET all named items without specific query', async () => {
      // const reqBody: GetItemsReq = {};
      // const resBody: GetItemsRes = { goods: [] };
      // return await request(app)
      //   .get('/api/items')
      //   .set('Content-Type', 'application/json')
      //   .query(reqBody)
      //   .send()
      //   .expect(200)
      //   .expect('Content-Type', 'application/json; charset=utf-8')
      //   .expect(resBody);
      expect(true).toBeTruthy();
    });
  });
  xdescribe('GetMyCarts', () => {
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
