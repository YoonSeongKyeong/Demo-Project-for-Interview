import React from 'react';
import { Card, Button } from 'antd';
import './ItemList_Item.css';
import { ShoppingFilled } from '@ant-design/icons';
import { ItemForm } from '../../interface/api';

const { Meta } = Card;

// ItemList_Item: 상품 이미지, 상품 이름, 판매자 이름, 가격 등을 볼 수 있고, 장바구니에 추가 기능을 이용할 수 있다.

const ItemList_Item: React.FC<{ item: ItemForm }> = ({ item }) => {
  return (
    <span>
      <Card
        className="item-list-card i-block"
        hoverable
        cover={<img src={item.titleImage} />}
      >
        <Meta title={item.name} description={`${item.provider}`} />
        <Meta title={item.price} />
        <Button
          className="ItemList-normal-item"
          type="primary"
          shape="circle"
          icon={<ShoppingFilled />}
        />
      </Card>
    </span>
  );
};

export default ItemList_Item;
