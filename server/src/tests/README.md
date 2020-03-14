# **API Test**
#### 목표: 전체 API에 대해, 가능한 상황들에 대해 최대한 높은 coverage를 보장.
<hr>

## **Test Migration Update Routine**

 ### **테스트 시 매번 일관된 Test Data를 사용해서 테스트를 진행할 수 있도록 Schema Creation 과정을 tests/migration에 저장해두고 beforeEach에서 dropDB와 runMigration을 반복한다. 이 때 사용하는 migration을 갱신하는 방법을 소개한다.**
- ### **yarn build를 실행시켜서 먼저 dist 폴더에 TypeORM 파일을 컴파일한다. (소스로 사용할 대상)**
- ### **미리 src/tests/migration 폴더를 비운다.**
- ### **config/env/.env (Create Schema => Migration File 용 환경설정)의 TYPEORM_DATABASE에 있는 DB를 어떤 Table도 없는 Empty Schema 상태로 만들어준다.**
- ### **CLI 창을 연 후 프로젝트 폴더 위치에서 다음 명령어를 실행한다.**
```powershell
npm run typeorm migration:generate -- -n <Migration 파일 이름>
```
- ### **서버 Schema를 생성하는 migration file을 얻었다. ./src/tests/migration/*.ts 에서 해당 파일 을 열어서 up-method에 Create Table query가 제대로 있는지 확인한다.**
- ### **yarn test로 테스트를 돌려서 잘 돌아가는지 확인한다.**

<hr>

## **< Test Scenario >**

<hr>

### **getItems**
```javascript
  *검색어가 없는 경우 (default === '')
  *검색어가 있는 경우
  *offset이 없는경우 (default === 0)
  *offset이 있는 경우 
    *pagination test
    *offset이 커서 찾은 상품이 없는 경우
  *limit이 없는경우 (default === 20)
  *limit이 있는 경우
    *limit이 상품 총 갯수보다 큰 경우
    *limit이 invalid한 경우 (0 이하)
```
<hr>

### **getMyCart**
```javascript
  *로그인이 안된 상황
    *wish 쿠키가 없는 경우
    *wish 쿠키가 있는 경우
    *invalid한 itemId가 wish 쿠키에 있는 경우
  *로그인이 된 상황
    *wish 쿠키가 없는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
        *등록된 wish가 없는 경우
        *등록된 wish가 있는 경우
    *wish 쿠키가 있는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
        *invalid한 itemId가 wish 쿠키에 있는 경우
          *등록된 wish가 없는 경우
          *등록된 wish가 있는 경우
        *wish 쿠키의 모든 itemId가 valid한 경우
          *등록된 wish가 없는 경우
          *등록된 wish가 있는 경우  
```
<hr>

### **postMyCart**
```javascript
  *로그인이 안된 상황
    *wish 쿠키가 없는 경우
    *wish 쿠키가 있는 경우
    *invalid한 itemId가 wish 쿠키에 있는 경우
  *로그인이 된 상황
    *wish 쿠키가 없는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
    *wish 쿠키가 있는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
        *invalid한 itemId가 wish 쿠키에 있는 경우
        *wish 쿠키의 모든 itemId가 valid한 경우
```
<hr>

### **deleteMyCart**
```javascript
  *로그인이 안된 상황
    *wish 쿠키가 없는 경우
    *wish 쿠키가 있는 경우
    *invalid한 itemId가 wish 쿠키에 있는 경우
  *로그인이 된 상황
    *wish 쿠키가 없는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
    *wish 쿠키가 있는 경우
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *valid한 유저
```
<hr>

### **purchaseItems**
```javascript
  *로그인이 안된 상황
  *로그인이 된 상황
    *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
    *valid한 유저
      *충전금이 부족한 경우
      *제출한 Item Form이 유효하지 않은 경우
      *Transaction시 충돌로 인해 결제가 실패한 경우(ex: 두 transaction이 동시에 같은 item의 재고 전부 구매를 시도하는 경우. 현재 Service 및 Controller에 명시적 에러 처리 x)
```
<hr>

## **< Test Data List >**
### **테스트 branch를 모두 접근할 수 있는 테스트 data feature 목록이다.**
```typescript
// src/test/testFeatureObj.ts
{
  Provider: [{ name: 'StyleShare' }, { name: '29cm' }, { name: 'HelloWorld' }],

  Item: [
    // 총 41개 상품
    {
      providerName: 'StyleShare',
      items: [
        // 6개 상품
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
        // 4개 상품
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
          itemFeature: { name: 'Expensive Umbrella Jacket', price: 999999 },
          options: [
            { color: 'black', size: 'S', stock: 1 },
            { color: 'black', size: 'M', stock: 1 },
            { color: 'black', size: 'L', stock: 1 },
          ],
          shipping: { method: 'PREPAY', price: 999999, canBundle: true },
        },
      ],
    },
    {
      providerName: 'HelloWorld',
      items: [
        // 31개 상품
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
    { name: 'ValidUser_EnoughCash', password: '1111', cash: 99999999, email: 'Valid@Lot.Cash' },
    { name: 'ValidUser_TestWish', password: '1111', cash: 99999999, email: 'Valid@Test.Wish' },
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

```