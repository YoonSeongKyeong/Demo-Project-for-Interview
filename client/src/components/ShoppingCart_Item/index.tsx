import React, { useState } from 'react';
import { Card, Checkbox, Tag, Select, InputNumber, Button } from 'antd';

import { ItemForm } from '../../interface/api';
import './style.css';
import { addOptionToPurchaseListActionInput } from '../../modules/shoppingCart';

const { Option } = Select;
// ShoppingCart_Item: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 배송방식을 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다.
// 다양한 옵션을 dropdown으로 선택할 수 있다. 구매할 상품 갯수를 선택해서 제출할 수 있다..

type itemProps = {
  item: ItemForm;
  onDeleteItemFromWishList: (itemId: number) => void;
  onAddOptionToPurchaseList: ({
    targetItem,
    option,
  }: addOptionToPurchaseListActionInput) => void;
  onSelect: (itemId: number) => void;
  onUnSelect: (itemId: number) => void;
  isChecked: boolean;
};

const ShoppingCart_Item: React.FC<itemProps> = ({
  item,
  onDeleteItemFromWishList,
  onAddOptionToPurchaseList,
  onSelect,
  onUnSelect,
  isChecked,
}) => {
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(0);
  const [numOfItemsToBuy, setNumOfItemsToBuy] = useState(0);

  const onChangeCheckBox = () => {
    if (isChecked) {
      onUnSelect(item.id);
    } else {
      onSelect(item.id);
    }
  };

  const minNum = 0;
  const maxNum = item.options[selectedOptionIndex].stock;

  const onChangeNumInput = (value: number) => {
    if (value >= minNum && value <= maxNum) {
      setNumOfItemsToBuy(value);
    }
  };

  const onChangeOption = value => {
    setSeletedOptionIndex(value);
    setNumOfItemsToBuy(0); // 구매할 상품 갯수도 기본값인 0으로 재설정한다.
  };

  const onDelete = () => {
    onDeleteItemFromWishList(item.id);
  };

  const onAdd = () => {
    if (numOfItemsToBuy > 0) {
      onAddOptionToPurchaseList({
        targetItem: item,
        option: {
          ...item.options[selectedOptionIndex],
          stock: numOfItemsToBuy,
        },
      });
    }
  };

  return (
    <Card
      style={{ marginTop: '1rem' }}
      type="inner"
      title={item.name}
      extra={<Checkbox checked={isChecked} onChange={onChangeCheckBox} />}
    >
      <img className="small-img" src={item.titleImage} alt="" />
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
          <Select
            defaultValue={0}
            className="select-option"
            onChange={onChangeOption}
          >
            {item.options.map((option, index) => (
              <Option value={index}>
                <Tag color="volcano">size</Tag>
                <Tag color="volcano">{option.size}</Tag>
                <Tag color="red">color</Tag>
                <Tag color="red">{option.color}</Tag>
              </Option>
            ))}
          </Select>
          <InputNumber
            value={numOfItemsToBuy}
            className="margin-1rem"
            min={minNum}
            max={maxNum}
            defaultValue={minNum}
            onChange={onChangeNumInput}
          />
          <span className="margin-1rem">
            <Tag color="gold">Stock</Tag>
            <Tag color="gold">{maxNum}</Tag>
          </span>
        </div>
        <Button
          type="danger"
          className="float-right margin-1rem"
          onClick={onDelete}
        >
          Delete From Wish List
        </Button>
        <Button
          type="primary"
          className="float-right margin-1rem"
          onClick={onAdd}
        >
          Add To Purchase List
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart_Item;
