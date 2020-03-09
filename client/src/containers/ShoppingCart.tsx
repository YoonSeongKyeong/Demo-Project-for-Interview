import React from "react";

import Item from "../components/ShoppingCart_Item";

// ShoppingCart에서는 장바구니의 상품들을 보여주고, 최종 금액을 계산해서 보여준다. 여러 개의 상품들을 구매/제거할 수 있다. 모두 선택, 모두 선택 해제 기능이 있다.
// ShoppingCart_Item: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다. 다양한 옵션을 선택할 수 있다. 구매할 상품 갯수를 선택할 수 있다. 배송방식을 선택할 수 있다.
// backToHome: 홈으로 돌아간다.
const goods = [
  {
    id: 1,
    name: "Python Hood T-Shirts",
    provider: "StyleShare",
    price: 20000,
    options: [
      {
        id: 1001,
        color: "yellow",
        size: "S",
        stock: 10
      },
      {
        id: 1002,
        color: "yellow",
        size: "M",
        stock: 10
      },
      {
        id: 1003,
        color: "yellow",
        size: "L",
        stock: 10
      },
      {
        id: 1004,
        color: "blue",
        size: "S",
        stock: 10
      },
      {
        id: 1005,
        color: "blue",
        size: "M",
        stock: 10
      },
      {
        id: 1006,
        color: "blue",
        size: "L",
        stock: 10
      }
    ],
    shipping: {
      method: "FREE",
      price: 0,
      canBundle: true
    }
  },
  {
    id: 2,
    name: "JAVA Round T-Shirts",
    provider: "StyleShare",
    price: 15000,
    options: [
      {
        id: 2001,
        color: "green",
        size: "S",
        stock: 10
      },
      {
        id: 2002,
        color: "green",
        size: "M",
        stock: 10
      },
      {
        id: 2003,
        color: "green",
        size: "L",
        stock: 10
      }
    ],
    shipping: {
      method: "PREPAY",
      price: 3000,
      canBundle: true
    }
  },
  {
    id: 3,
    name: "PHP V Neck T-Shirts",
    provider: "StyleShare",
    price: 15000,
    options: [
      {
        id: 3001,
        color: "violet",
        size: "S",
        stock: 10
      },
      {
        id: 3002,
        color: "violet",
        size: "M",
        stock: 10
      },
      {
        id: 3003,
        color: "violet",
        size: "L",
        stock: 10
      }
    ],
    shipping: {
      method: "PREPAY",
      price: 5000,
      canBundle: false
    }
  },
  {
    id: 4,
    name: "Flask Jacket",
    provider: "StyleShare",
    price: 3000,
    options: [
      {
        id: 4001,
        color: "black",
        size: "S",
        stock: 10
      },
      {
        id: 4002,
        color: "black",
        size: "M",
        stock: 10
      },
      {
        id: 4003,
        color: "black",
        size: "L",
        stock: 10
      }
    ],
    shipping: {
      method: "FREE",
      price: 0,
      canBundle: true
    }
  },
  {
    id: 5,
    name: "Spring Boot Jacket",
    provider: "StyleShare",
    price: 20000,
    options: [
      {
        id: 5001,
        color: "yellowgreen",
        size: "S",
        stock: 10
      },
      {
        id: 5002,
        color: "yellowgreen",
        size: "M",
        stock: 10
      },
      {
        id: 5003,
        color: "yellowgreen",
        size: "L",
        stock: 10
      },
      {
        id: 5004,
        color: "yellowgreen",
        size: "XL",
        stock: 10
      }
    ],
    shipping: {
      method: "FREE",
      price: 0,
      canBundle: true
    }
  },
  {
    id: 6,
    name: "Codeigniter Jacket",
    provider: "StyleShare",
    price: 5000,
    options: [
      {
        id: 6001,
        color: "red",
        size: "S",
        stock: 100
      },
      {
        id: 6002,
        color: "red",
        size: "M",
        stock: 120
      }
    ],
    shipping: {
      method: "PREPAY",
      price: 5000,
      canBundle: false
    }
  },
  {
    id: 7,
    name: "Django Jacket",
    provider: "29cm",
    price: 15000,
    options: [
      {
        id: 7001,
        color: "green",
        size: "M",
        stock: 0
      },
      {
        id: 7002,
        color: "green",
        size: "L",
        stock: 30
      }
    ],
    shipping: {
      method: "PREPAY",
      price: 2500,
      canBundle: true
    }
  }
];
const ShoppingCart: React.FC = () => {
  return (
    <>
      {goods.map(item => (
        <Item item={item} key={item.id} />
      ))}
    </>
  );
};

export default ShoppingCart;
