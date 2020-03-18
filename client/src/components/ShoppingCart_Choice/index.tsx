import React from 'react';
import { Card, Tag, Button } from 'antd';
import './style.css';

// ShoppingCart_Choice: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다.
// 다양한 옵션을 선택할 수 있다. 구매할 상품 갯수를 선택할 수 있다. 배송방식을 선택할 수 있다.

const ShoppingCart_Choice: React.FC<{ item: any }> = ({ item }) => {
  return (
    <Card style={{ marginTop: '1rem' }} type="inner" title={item.name}>
      <img className="small-img" src={item.titleImage} />
      <div>
        <div className="item-info ">
          <span className="margin-1rem">
            <Tag color="blue">
              <span>Provider</span>
            </Tag>
            <Tag color="blue">
              <span>{item.provider}</span>
            </Tag>
          </span>
          <span className="margin-1rem">
            <Tag color="green">
              <span>Price</span>
            </Tag>
            <Tag color="green">
              <span>{item.price}</span>
            </Tag>
          </span>
          <span className="margin-1rem">
            <Tag color="magenta">
              <span>Shipping Method</span>
            </Tag>
            <Tag color="magenta">
              <span>{item.shipping.method}</span>
            </Tag>
          </span>
          <span className="margin-1rem">
            <Tag color="purple">
              <span>Shipping Fee</span>
            </Tag>
            <Tag color="purple">
              <span>{item.shipping.price}</span>
            </Tag>
          </span>
          {item.shipping.canBundle && (
            <span className="margin-1rem">
              <Tag color="geekblue">
                <span>{'Can Bundle'}</span>
              </Tag>
            </span>
          )}
        </div>
        <div className="">
          <span className="margin-1rem">
            <Tag color="volcano">size</Tag>
            <Tag color="volcano">L</Tag>
          </span>
          <span className="margin-1rem">
            <Tag color="red">color</Tag>
            <Tag color="red">Green</Tag>
          </span>
          <span className="margin-1rem">
            <Tag color="gold">amount</Tag>
            <Tag color="gold">10</Tag>
          </span>
        </div>
        <Button type="danger" className="float-right margin-1rem">
          Delete From Purchase List
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart_Choice;
