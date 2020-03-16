import React from 'react';
import { Card, Checkbox, Tag, Select, InputNumber, Button } from 'antd';
import { ItemForm } from '../../interface/api';
import './ShoppingCart_Item.css';

const { Option } = Select;
// ShoppingCart_Item: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 배송방식을 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다.
// 다양한 옵션을 dropdown으로 선택할 수 있다. 구매할 상품 갯수를 선택해서 제출할 수 있다..

const ShoppingCart_Item: React.FC<{ item: ItemForm }> = ({ item }) => {
  return (
    <Card
      style={{ marginTop: '1rem' }}
      type="inner"
      title={item.name}
      extra={<Checkbox />}
    >
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
          <Select defaultValue="Choose The Option" className="select-option">
            {item.options.map(option => (
              <Option value={option.id}>
                <Tag color="volcano">size</Tag>
                <Tag color="volcano">{option.size}</Tag>
                <Tag color="red">color</Tag>
                <Tag color="red">{option.color}</Tag>
              </Option>
            ))}
          </Select>
          <InputNumber
            className="margin-1rem"
            min={1}
            max={10}
            defaultValue={1}
          />
          <span className="margin-1rem">
            <Tag color="gold">Stock</Tag>
            <Tag color="gold">10</Tag>
          </span>
        </div>
        <Button type="danger" className="float-right margin-1rem">
          Delete From Wish List
        </Button>
        <Button type="primary" className="float-right margin-1rem">
          Add To Purchase List
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart_Item;
