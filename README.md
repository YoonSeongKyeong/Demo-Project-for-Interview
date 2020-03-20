# **Mini Project : 상품 리스트 및 장바구니 기능 구현 과제**

### **Developed by 윤성경**

<hr>

## **실행 방법**
- ### **Server 실행법**
- - ### **/server에 config라는 설정파일 추가, config에 환경변수 설정 후 /server 에서 yarn으로 의존성 설치** 
- - ### **/server/src/tests/migration에 Schema refresh migration file 생성 (/server/src/tests/README.md 참고)**
- - ### **/server에서 yarn dev 실행 시 개발 서버 실행, yarn test 실행 시 테스트 실행**

- ### **Client 실행법**
- - ### **/client에서 yarn으로 의존성 설치** 
- - ### **/client에서 yarn start 실행 시 개발 클라이언트 실행(현재 서버와 연결되지 않았음)** 

<hr>

## **사용 테스트 시나리오**
- ### **yarn test로 서버를 미리 테스트해보고 전부 통과하는지 확인한다.**
- ### **클라이언트와 서버를 각각 yarn start, yarn dev로 실행시킨다.**
- ### **로그인 없이 사용**
- - ### **ItemList 버튼을 눌러서 ItemList에 들어간다**
- - ### **Infinite Scroll로 상품을 불러올 수 있는지 테스트한다.**
- - ### **검색어를 넣어보고 Search버튼 클릭 및 엔터로 검색이 제대로 되는지, Infinite Scroll이 작동하는지 확인한다.**
- - ### **(Scroll에 의한 핸들러 호출은 Lodash.debounce로 효율적으로 사용된다.)**
- - ### **(상품을 다 불러오면 검색을 새로 하지 않는 이상, 더이상 상품 요청을 보내지 않는다.)**
- - ### **오른쪽 아래의 BackTop을 눌러서 한번에 위로 올라가는지 확인한다.**
- - ### **집모양 Home 버튼을 눌러서 Home으로 돌아간다.**
- - ### **WishList 버튼을 눌러서 WishList에 들어간다.**
- - ### **장바구니에 등록된 상품들을 확인한다.**
- - ### **오른쪽 아래의 BackTop을 눌러서 한번에 위로 올라가는지 확인한다.**
- - ### **ItemList로 가서 상품의 장바구니 버튼을 눌러서 장바구니에 추가한다.**
- - ### **"장바구니에 상품이 성공적으로 추가되었습니다!" 라는 alert가 나오며 장바구니에 추가된다.**
- - ### **다시 WishList에서 상품들이 장바구니에 잘 추가되었는지 확인한다.**
- - ### **장바구니 Item의 DropDown으로 여러 옵션을 선택해보며, 옵션마다 Stock이 제대로 표시되는지 확인한다.**
- - ### **Number Input으로 상품 갯수를 선택할 때 0 이상 Stock 이하의 유효한 값으로 선택이 제한 되는지 확인한다.**
- - ### **옵션을 바꿀 때 Number Input이 0으로 초기화되는지 확인한다.**
- - ### **상품 안에서 Delete From Wish List를 눌렀을 때 해당 상품이 잘 사라지는지 확인한다.**
- - ### **여러 상품을 맨 위 오른쪽의 global  체크박스로 한번에 체크할 수 있는지, 개별 체크박스를 체크할 수 있는지 확인한다.**
- - ### **Delete Selected Items From Wish List를 눌렀을 때 체크된 상품들이 잘 사라지는지 확인한다.**
- - ### **옵션을 선택하고, 상품 구매 갯수를 0으로 입력한 후 Add To Purchase List를 누르면 아무것도 추가되지 않는지 확인한다.**
- - ### **옵션을 선택하고, Stock이 1 이상인 경우 상품 구매 갯수를 1 이상으로 입력한 후 Add To Purchase List를 누르면 해당 옵션이 Purchase List에 추가되는지 확인한다.**
- - ### **상품 가격 및 배송비, Total Price가 잘 표시되는지 확인한다.**
- - ### **방금 추가한 같은 옵션에서 상품 구매 갯수를 바꿔서 Add To Purchase List를 누르면, 방금 추가된 옵션에서 amount 갯수만 변경되는지 확인한다.**
- - ### **변경된 상품 가격 및 배송비, Total Price가 잘 표시되는지 확인한다.**
- - ### **같은 Item에서 여러 Option을 Add To Purchase List로 추가했을 때, 옵션마다 Purchase List에 잘 표시되는지 확인한다.**
- - ### **Purchase the Items In Purchase List 버튼을 눌렀을 때 "상품 구매가 실패했습니다." 라는 alert가 나오는지 확인한다.**
- ### **로그인 해서 사용**
- - ### **Home에서 SignOut 버튼을 눌렀을 때 항상 "로그아웃이 완료되었습니다"라는 alert가 나오며 auth 쿠키가 clear된다.**
- - ### **Home에서 SignIn 버튼을 눌렀을 때 로그인되어 있지 않으므로 Home으로 자동 redirect되지 않는다.**
- - ### **email은 email형식 및 필수 항목으로 validation된다. password도 숨김 기능을 갖고 있고, 필수 항목으로 validation된다.**
- - ### **email로 "a@a.a", password로 "a" 같은 등록되어 있지 않은 정보를 입력하면 "로그인 정보가 유효하지 않습니다."라는 alert가 나온다.**
- - ### **email로 "Valid@No.Cash", password로 "1111" 같은 등록되어 있는 정보를 입력하면 "로그인이 성공헸습니다!"라는 alert가 나오며 Home으로 redirect된다.**
- - ### **로그인된 상태로 SignIn을 들어가면 "이미 로그인되어 있습니다."라는 alert가 나오며 Home으로 redirect된다.**
- - ### **뭔가 사려고 한다면, 가격이 0이 아닌 한 "상품 구매가 실패했습니다."라는 alert가 나오게 된다.**
- - ### **다시 email: "Valid@Test.Wish" password: "1111"로 로그인한 후, WishList로 가게 되면, 내가 로컬에서 장바구니에 넣었던 상품들 + 계정에 등록된 상품들이 같이 나온다.**
- - ### **또한 계정이 있는 상태에서 장바구니 받아오기, 추가 또는 삭제를 한번이라도 했다면 로컬의 장바구니 정보가 계정으로 merge된다.**
- - ### **로그인하지 않은 상태에서 Search Tester Hello World 10같은 계정에 등록되지 않은 아이템을 로컬에 추가한 뒤, 계정으로 로그인하고 장바구니에 갔다가**
- - ### **, 로그아웃하고 장바구니를 모두 비우고 다시 같은 계정으로 로그인했을 때 계정에 아이템이 등록되는지 확인하면 된다.**
- - ### **반대로 계정에 등록된 장바구니 정보는 local로 merge되지 않는다. 보안 이유 때문에 그렇게 만들었다.**
- - ### **마지막으로 email: "Valid@Lot.Cash" password: "1111"로 로그인한 후, WishList로 가서 상품을 구매하면**
- - ### **, "상품 구매가 성공했습니다! 총 가격은 <총 가격> 입니다."라는 alert가 나오며 상품 구매가 성공한다.**
- - ### **내부적으로는 유저의 Cash를 확인하고, 제출된 모든 상품 정보가 DB에 저장된 값들과 일치하는지 확인하고, 재고가 충분한지 확인하는 과정을 거친 뒤, Deadlock Free Transaction으로 유저 Cash를 차감하며**
- - ### **, 각 Option마다, Provider id, 상품 id, option json log, shipping json log를 DB에 저장해서 추후 옵션 정보가 바뀌더라도 구매 정보를 유지할 수 있게 만들었다.**

<hr>

## **진행상황**
- ### **Client 연결 - ItemList ,WishList 및 SignIn SignOut 구현 (2020.03.19)**
- ### **Client 연결 - ItemList 모듈 reducer 구현 (2020.03.18)**
- ### **Client에 대해서 ItemList Page와 WishList Page의 View와 함께 Structure을 정의 (2020.03.16)**
- ### **Server에 대해서 High Quality & Full Path Coverage Integration Test 완성 (2020.03.15)**
- ### **TypeORM의 getRepository시 버전 업데이트로 인한 비정상적 동작 이슈 제보, API 테스트 추가 (2020.03.14)**
- ### **TypeORM에서 Connection이 비정상적으로 동작하는 이슈 발견, 이슈 해결 작업 (2020.03.13)**
- ### **Server 테스트 설계 및 테스트 데이터 준비, 테스트 Setup 구현 (2020.03.12)**
- ### **Server /Service: 90% 구현 및 결제 유틸 함수들 설계 및 구현 (2020.03.11)**
- ### **Server /Factory: 100%, Router:90%, /Controller: 80% /Service: 30% 구현 (2020.03.10)**
- ### **Server 구조 기획 및 폴더 구조로 layered structure 구현, ER Diagram 및 Relational Model 설계 (2020.03.09)**
- ### **Client 스터디 (React + Redux + Typescript) (2020.03.08)**
- ### **프로젝트 기본 구조 설계 (2020.03.07)**
- ### **기획 문서 작성 (2020.03.06)**

<hr>

## **과제 조건**

<hr>

## 문제

- 다음 데이터셋을 보고 상품 리스트 웹 페이지와 장바구니 웹 페이지를 구현해 주세요.

    [goods.json](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fabee6e1-90c3-4d8a-8c99-066c0951dbf8/goods.json)

- 데이터셋
```json
{
  "goods": [
    {
      "id": 1,
      "name": "Python Hood T-Shirts",
      "provider": "StyleShare",
      "price": 20000,
      "options": [
        {
          "id": 1001,
          "color": "yellow",
          "size": "S",
          "stock": 10
        },
        {
          "id": 1002,
          "color": "yellow",
          "size": "M",
          "stock": 10
        },
        {
          "id": 1003,
          "color": "yellow",
          "size": "L",
          "stock": 10
        },
        {
          "id": 1004,
          "color": "blue",
          "size": "S",
          "stock": 10
        },
        {
          "id": 1005,
          "color": "blue",
          "size": "M",
          "stock": 10
        },
        {
          "id": 1006,
          "color": "blue",
          "size": "L",
          "stock": 10
        }
      ],
      "shipping": {
        "method": "FREE",
        "price": 0,
        "canBundle": true
      }
    },
    {
      "id": 2,
      "name": "JAVA Round T-Shirts",
      "provider": "StyleShare",
      "price": 15000,
      "options": [
        {
          "id": 2001,
          "color": "green",
          "size": "S",
          "stock": 10
        },
        {
          "id": 2002,
          "color": "green",
          "size": "M",
          "stock": 10
        },
        {
          "id": 2003,
          "color": "green",
          "size": "L",
          "stock": 10
        }
      ],
      "shipping": {
        "method": "PREPAY",
        "price": 3000,
        "canBundle": true
      }
    },
    {
      "id": 3,
      "name": "PHP V Neck T-Shirts",
      "provider": "StyleShare",
      "price": 15000,
      "options": [
        {
          "id": 3001,
          "color": "violet",
          "size": "S",
          "stock": 10
        },
        {
          "id": 3002,
          "color": "violet",
          "size": "M",
          "stock": 10
        },
        {
          "id": 3003,
          "color": "violet",
          "size": "L",
          "stock": 10
        }
      ],
      "shipping": {
        "method": "PREPAY",
        "price": 5000,
        "canBundle": false
      }
    },
    {
      "id": 4,
      "name": "Flask Jacket",
      "provider": "StyleShare",
      "price": 3000,
      "options": [
        {
          "id": 4001,
          "color": "black",
          "size": "S",
          "stock": 10
        },
        {
          "id": 4002,
          "color": "black",
          "size": "M",
          "stock": 10
        },
        {
          "id": 4003,
          "color": "black",
          "size": "L",
          "stock": 10
        }
      ],
      "shipping": {
        "method": "FREE",
        "price": 0,
        "canBundle": true
      }
    },
    {
      "id": 5,
      "name": "Spring Boot Jacket",
      "provider": "StyleShare",
      "price": 20000,
      "options": [
        {
          "id": 5001,
          "color": "yellowgreen",
          "size": "S",
          "stock": 10
        },
        {
          "id": 5002,
          "color": "yellowgreen",
          "size": "M",
          "stock": 10
        },
        {
          "id": 5003,
          "color": "yellowgreen",
          "size": "L",
          "stock": 10
        },
        {
          "id": 5004,
          "color": "yellowgreen",
          "size": "XL",
          "stock": 10
        }
      ],
      "shipping": {
        "method": "FREE",
        "price": 0,
        "canBundle": true
      }
    },
    {
      "id": 6,
      "name": "Codeigniter Jacket",
      "provider": "StyleShare",
      "price": 5000,
      "options": [
        {
          "id": 6001,
          "color": "red",
          "size": "S",
          "stock": 100
        },
        {
          "id": 6002,
          "color": "red",
          "size": "M",
          "stock": 120
        }
      ],
      "shipping": {
        "method": "PREPAY",
        "price": 5000,
        "canBundle": false
      }
    },
    {
      "id": 7,
      "name": "Django Jacket",
      "provider": "29cm",
      "price": 15000,
      "options": [
        {
          "id": 7001,
          "color": "green",
          "size": "M",
          "stock": 0
        },
        {
          "id": 7002,
          "color": "green",
          "size": "L",
          "stock": 30
        }
      ],
      "shipping": {
        "method": "PREPAY",
        "price": 2500,
        "canBundle": true
      }
    }
  ]
}
```

- 상품 리스트 페이지
    - 상품 리스트를 조회할 수 있다.
    - 단일 상품을 장바구니에 추가할 수 있다.
- 장바구니 페이지
    - 현재 장바구니에 담긴 상품들을 조회할 수 있다.
    - 현재 장바구니에 담긴 상품들을 N개 구매할 수 있다.
    - 현재 장바구니에 담긴 상품들을 N개 제거할 수 있다.
    - 최종 결제 금액을 조회 할 수 있다.

## 주의 사항

- Git을 사용해주세요
- 사용 언어에 대한 제약은 없습니다.
- 데이터셋 json 파일(goods.json)을 보고 데이터베이스(DBMS)를 구성하여 구현해주세요.
- 모든 기능을 모두 구현할 필요도 없습니다. 반대로 시간이 더 필요하시면 말씀(연락)해주세요.
- 그 외에 필요하다고 생각되는 기능을 추가 개발하셔도 좋습니다.
- 제출한 프로젝트를 다른 개발자가 로컬환경에서 셋팅 하는 것을 가정해주세요. 따라서 README 파일에 어플리케이션 실행 방법에 대한 설명을 작성해야 합니다.

## 평가기준

- 문제의 전체 기능이 구현이 안되어도 무관합니다.
- 웹 서비스에 대한 이해도를 평가 합니다.
- 어플리케이션 설계 능력을 평가합니다.
- Test 작성시 가산점이 있습니다.

## 제출방법

- 정해드린 기한까지 과제를 제출해주세요. (메일은 하단에 안내되어있습니다.)
- 원활한 결과물 제출을 위해 Github private repository를 만들어드리고 있습니다. 과제 시작시 Github ID를 전달해주시면 레포지토리 생성 후 collaborator로 초대를 해드리겠습니다.
- Github을 사용하지 않을거라면 소스코드는 zip파일로 압축해서 메일로 전달해주세요. (메일 주소는 하단에 있습니다)

## 데이터셋(goods.json) 설명
```javascript
    {
      "goods":[
        {
          "id": 1, // 상품 ID
          "name": "goods_name", // 상품 이름
          "provider": "styleShare", // 입점사(상품 등록자) 이름
          "price": 20000, // 상품 가격
          "options": [ // 상품 옵션
            {
              "id": 1001, // 옵션 ID
              "color": "yellow", // 옵션 제목: 옵션명
              "size": "S", // 옵션제목: 옵션명
              "stock": 10 // 재고
            }
          ],
          "shipping": { // 배송정책
            "method": "{FREE | PREEPAY}", // 배송비 부과 여부. 무료배송(`FREE`), 유료배송(`PREPAY`) 존재.
            "price": 0, // 배송비
            "canBundle": true // 같은 입점사 상품의 묶음배송 가능 여부, 가능시 묶음배송가능한 상품의 배송비는 한번만 부과. 묶음 배송가능 상품들의 배송 비용이 다를경우 최저금액을 적용. 불가능시 상품마다 배송비 부과
          }
        }
      ]
    }
```

**문의사항이 있으시거나 과제 제출시 `rokee@styleshare.kr` 로 메일 부탁드립니다 :)**