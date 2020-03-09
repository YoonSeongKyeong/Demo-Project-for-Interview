import React from 'react';

// ItemList_Item: 상품 이미지, 상품 이름, 판매자 이름, 가격 등을 볼 수 있고, 장바구니에 추가/삭제 기능을 이용할 수 있다.

const ItemList_Item:React.FC<{item:any}> = ({item}) => {

    console.log(item)
  return (
    <>
      ItemList_Item
    </>
  );
};

export default ItemList_Item;