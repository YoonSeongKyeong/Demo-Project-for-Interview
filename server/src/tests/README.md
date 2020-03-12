# **API Test**
#### 목표: 전체 API에 대해, 가능한 상황들에 대해 최대한 높은 coverage를 보장.
<hr>

## **Test Migration Update Routine**

 ### **테스트 시 매번 일관된 Test Data를 사용해서 테스트를 진행할 수 있도록 Schema Creation 과정을 tests/migration에 저장해두고 beforeEach에서 dropDB와 runMigration을 반복한다. 이 때 사용하는 migration을 갱신하는 방법을 소개한다.**
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
  *로그인이 된 상황
    *wish 쿠키가 없는 경우
      *valid한 유저
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
    *wish 쿠키가 있는 경우
      *valid한 유저
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *invalid한 itemId가 wish 쿠키에 있는 경우
  *로그인이 안된 상황
    *wish 쿠키가 없는 경우
    *wish 쿠키가 있는 경우
```
<hr>

### **postMyCart**
```javascript
  *로그인이 된 상황
    *wish 쿠키가 없는 경우
      *valid한 유저
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
    *wish 쿠키가 있는 경우
      *valid한 유저
      *invalid한 유저(ex: 삭제된 경우 status를 404로 만들어서 기록을 보존한다. 현재 User Entity에 status 구현 x)// !ISSUE 유저 삭제 정책을 기획해야 한다.
      *invalid한 itemId가 wish 쿠키에 있는 경우
  *로그인이 안된 상황
    *wish 쿠키가 없는 경우
    *wish 쿠키가 있는 경우
```
<hr>

### **deleteMyCart**
```javascript
  *branch
    *nestedBranch
  *branch
```
<hr>

### **purchaseItems**
```javascript
  *branch
    *nestedBranch
  *branch
```
<hr>

## **< Test Data List >**

```typescript
// src/test/testFeatureObj.ts
{
  Company: [],

  User: [],

  Items: [],
}
```