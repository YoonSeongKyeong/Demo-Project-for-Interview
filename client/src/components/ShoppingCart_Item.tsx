import React from 'react';

// ShoppingCart_Item: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다.
// 다양한 옵션을 선택할 수 있다. 구매할 상품 갯수를 선택할 수 있다. 배송방식을 선택할 수 있다.

const ShoppingCart_Item:React.FC<{item:any}> = ({item}) => {

    console.log(item)
  return (
    <>
      ShoppingCart_Item
    </>
  );
};

export default ShoppingCart_Item;