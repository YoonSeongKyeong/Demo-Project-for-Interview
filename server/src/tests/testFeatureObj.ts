/* eslint-disable @typescript-eslint/camelcase */

import { TestFeature } from '../interface/serversideSpecific';

export const testFeatureObj: TestFeature = {
  Provider: [{ name: 'StyleShare' }, { name: '29cm' }, { name: 'HelloWorld' }],

  Item: [
    {
      providerName: 'StyleShare',
      items: [
        {
          itemFeature: { name: 'Python Hood T-Shirts', price: 20000 },
          options: [
            { color: 'yellow', size: 'S', stock: 10 },
            { color: 'yellow', size: 'M', stock: 10 },
            { color: 'yellow', size: 'L', stock: 10 },
            { color: 'blue', size: 'S', stock: 10 },
            { color: 'blue', size: 'M', stock: 10 },
            { color: 'blue', size: 'L', stock: 10 },
          ],
          shipping: { method: 'FREE', price: 0, canBundle: true },
        },
        {
          itemFeature: { name: 'JAVA Round T-Shirts', price: 15000 },
          options: [
            { color: 'green', size: 'S', stock: 10 },
            { color: 'green', size: 'M', stock: 10 },
            { color: 'green', size: 'L', stock: 10 },
          ],
          shipping: { method: 'PREPAY', price: 3000, canBundle: true },
        },
        {
          itemFeature: { name: 'PHP V Neck T-Shirts', price: 15000 },
          options: [
            { color: 'violet', size: 'S', stock: 10 },
            { color: 'violet', size: 'M', stock: 10 },
            { color: 'violet', size: 'L', stock: 10 },
          ],
          shipping: { method: 'PREPAY', price: 5000, canBundle: false },
        },
        {
          itemFeature: { name: 'Flask Jacket', price: 3000 },
          options: [
            { color: 'black', size: 'S', stock: 10 },
            { color: 'black', size: 'M', stock: 10 },
            { color: 'black', size: 'L', stock: 10 },
          ],
          shipping: { method: 'FREE', price: 0, canBundle: true },
        },
        {
          itemFeature: { name: 'Spring Boot Jacket', price: 20000 },
          options: [
            { color: 'yellowgreen', size: 'S', stock: 10 },
            { color: 'yellowgreen', size: 'M', stock: 10 },
            { color: 'yellowgreen', size: 'L', stock: 10 },
            { color: 'yellowgreen', size: 'XL', stock: 10 },
          ],
          shipping: { method: 'FREE', price: 0, canBundle: true },
        },
        {
          itemFeature: { name: 'Codeigniter Jacket', price: 5000 },
          options: [
            { color: 'red', size: 'S', stock: 100 },
            { color: 'red', size: 'M', stock: 120 },
          ],
          shipping: { method: 'PREPAY', price: 5000, canBundle: true },
        },
      ],
    },
    {
      providerName: '29cm',
      items: [
        {
          itemFeature: { name: 'Django Jacket', price: 15000 },
          options: [
            { color: 'green', size: 'M', stock: 0 },
            { color: 'green', size: 'L', stock: 30 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        },
        {
          itemFeature: { name: 'camelCase Jacket', price: 20000 },
          options: [
            { color: 'gray', size: 'S', stock: 100 },
            { color: 'gray', size: 'M', stock: 10 },
            { color: 'gray', size: 'L', stock: 30 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        },
        {
          itemFeature: { name: 'KF94 Mask', price: 1500 },
          options: [
            { color: 'white', size: 'S', stock: 30 },
            { color: 'white', size: 'M', stock: 30 },
            { color: 'white', size: 'L', stock: 30 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        },
        {
          itemFeature: { name: 'Expensive Umbrella Jacket', price: 99999999 },
          options: [
            { color: 'black', size: 'S', stock: 1 },
            { color: 'black', size: 'M', stock: 1 },
            { color: 'black', size: 'L', stock: 1 },
          ],
          shipping: { method: 'PREPAY', price: 99999999, canBundle: true },
        },
      ],
    },
    {
      providerName: 'HelloWorld',
      items: [
        {
          itemFeature: { name: 'Jest Vest', price: 25000 },
          options: [
            { color: 'black', size: 'S', stock: 10 },
            { color: 'black', size: 'M', stock: 20 },
            { color: 'black', size: 'L', stock: 30 },
            { color: 'black', size: 'XL', stock: 30 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        },
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
          itemFeature: { name: `SEARCH Tester Hello World ${num}`, price: 5000 },
          options: [
            { color: 'white', size: 'S', stock: 10 },
            { color: 'white', size: 'M', stock: 10 },
            { color: 'white', size: 'L', stock: 0 },
            { color: 'white', size: 'XL', stock: 10 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        })),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
          itemFeature: { name: `SEARCH Tester Bye World ${num}`, price: 5000 },
          options: [
            { color: 'white', size: 'S', stock: 10 },
            { color: 'white', size: 'M', stock: 10 },
            { color: 'white', size: 'L', stock: 0 },
            { color: 'white', size: 'XL', stock: 10 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        })),
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
          itemFeature: { name: `SEARCH Tester Hello StyleShare ${num}`, price: 5000 },
          options: [
            { color: 'white', size: 'S', stock: 10 },
            { color: 'white', size: 'M', stock: 10 },
            { color: 'white', size: 'L', stock: 0 },
            { color: 'white', size: 'XL', stock: 10 },
          ],
          shipping: { method: 'PREPAY', price: 2500, canBundle: true },
        })),
      ],
    },
  ],

  User: [
    { name: 'ValidUser_NotEnoughCash', password: '1111', cash: 0, email: 'Valid@No.Cash' },
    { name: 'ValidUser_EnoughCash', password: '1111', cash: 9999999999, email: 'Valid@Lot.Cash' },
    { name: 'ValidUser_TestWish', password: '1111', cash: 9999999999, email: 'Valid@Test.Wish' },
  ],

  Wish: [
    { itemInfo: { itemName: 'Python Hood T-Shirts' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'JAVA Round T-Shirts' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'PHP V Neck T-Shirts' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'Flask Jacket' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'Spring Boot Jacket' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'Codeigniter Jacket' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'Django Jacket' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'camelCase Jacket' }, userInfo: { email: 'Valid@Test.Wish' } },
    { itemInfo: { itemName: 'KF94 Mask' }, userInfo: { email: 'Valid@Test.Wish' } },
  ],

  Purchased: [],
};
