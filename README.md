# **Mini Project : 상품 리스트 및 장바구니 기능 구현 과제**

### **Developed by 윤성경**

<hr>

## **진행상황**
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