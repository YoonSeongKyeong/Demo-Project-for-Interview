import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert, Tooltip, BackTop, Card, Affix, Checkbox } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import {
  getItemsFromWishListThunk,
  deleteItemsFromWishListThunk,
  purchaseItemsThunk,
} from '../../modules/shoppingCart/thunks';
import './style.css';
import { RootState } from '../../modules';
import Item from '../../components/ShoppingCart_Item';
import Choice from '../../components/ShoppingCart_Choice';
import {
  addOptionToPurchaseList,
  deleteOptionFromPurchaseList,
  addOptionToPurchaseListActionInput,
  deleteOptionFromPurchaseListActionInput,
} from '../../modules/shoppingCart';
import { getTotalPriceByItemFormList } from '../../libs/getTotalPrice';

// ShoppingCart에서는 장바구니의 상품들을 보여주고, 최종 금액을 계산해서 보여준다. 여러 개의 상품들을 구매/제거할 수 있다. 모두 선택, 모두 선택 해제 기능이 있다.
// ShoppingCart_Item: 상품 사진, 상품 이름, 판매자 이름, 가격 및 재고를 보여준다. 상품을 선택할 수 있다. 상품을 제거할 수 있다. 다양한 옵션을 선택할 수 있다. 구매할 상품 갯수를 선택할 수 있다. 배송방식을 선택할 수 있다.
// backToHome: 홈으로 돌아간다.

const ShoppingCart: React.FC = () => {
  const [selectionList, setSelectionList] = useState([]); // checkbox를 선택한 아이템들의 id 목록

  // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
  const { wishList, purchaseList } = useSelector(
    (state: RootState) => state.shoppingCart
  );
  const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다

  // 각 액션들을 디스패치하는 함수들을 만들어줍니다
  const onGetItemsFromWishList = () => {
    // Wish List를 처음에 가져오는 용도로 사용
    dispatch(getItemsFromWishListThunk());
  };

  const onDeleteSelectedItemsFromWishList = () => {
    // 선택한 상품들을 한번에 장바구니에서 삭제하는 데 사용.
    dispatch(deleteItemsFromWishListThunk(selectionList));
  };

  const onDeleteItemFromWishList = (itemId: number) => {
    // 상품을 장바구니에서 삭제하는 데 사용.
    dispatch(deleteItemsFromWishListThunk([itemId]));
  };

  const onAddOptionToPurchaseList = ({
    targetItem,
    option,
  }: addOptionToPurchaseListActionInput) => {
    // 상품 옵션을 구매 목록에 추가하는데 사용
    dispatch(addOptionToPurchaseList({ targetItem, option }));
  };

  const onDeleteOptionFromPurchaseList = ({
    itemId,
    optionId,
  }: deleteOptionFromPurchaseListActionInput) => {
    // 상품 옵션을 구매 목록에서 삭제하는데 사용
    dispatch(deleteOptionFromPurchaseList({ itemId, optionId }));
  };

  const onPurchase = () => {
    // 구매 목록의 옵션대로 상품 구매를 위해 사용
    dispatch(purchaseItemsThunk());
  };

  const onSelectAll = () => {
    // 모든 장바구니 상품을 선택
    setSelectionList(wishList.map(item => item.id));
  };

  const onUnSelectAll = () => {
    // 모든 장바구니 상품을 선택 해제
    setSelectionList([]);
  };

  const onSelect = (itemId: number) => {
    // 하나의 장바구니 상품을 선택
    if (!selectionList.includes(itemId)) {
      setSelectionList([...selectionList, itemId]);
    }
  };

  const onUnSelect = (itemId: number) => {
    // 하나의 장바구니 상품을 선택 해제
    setSelectionList(selectionList.filter(id => id !== itemId));
  };

  const isGlobalCheckBoxEmpty = selectionList.length === 0;

  const onChangeGlobalCheckBox = () => {
    if (isGlobalCheckBoxEmpty) {
      onSelectAll();
    } else {
      onUnSelectAll();
    }
  };

  useEffect(() => {
    onGetItemsFromWishList();
  }, []); // ComponentDidMount와 같은 효과로 사용하기 위해 []를 두번째 인자로 사용해야 한다.

  const { totalPrice, totalShippingFee } = getTotalPriceByItemFormList(
    purchaseList
  );

  return (
    <div className="text-center align-center">
      <Alert
        message="ShoppingCart"
        type="info"
        className="width-third-center ShoppingCart-normal-item"
      />

      <Tooltip title="Home">
        <Link to="/">
          <Button
            className="ShoppingCart-normal-item"
            type="danger"
            shape="circle"
            icon={<HomeFilled />}
          />
        </Link>
      </Tooltip>

      <Card
        title="Wish List"
        className="align-left margin-top-1rem"
        extra={
          <Checkbox
            checked={!isGlobalCheckBoxEmpty}
            onChange={onChangeGlobalCheckBox}
          />
        }
      >
        <span className="">Choose The Option To Purchase</span>
        <Button
          className="float-right"
          type="danger"
          onClick={onDeleteSelectedItemsFromWishList}
        >
          Delete Selected Items From Wish List
        </Button>
        {wishList.map(item => (
          <Item
            item={item}
            key={item.id}
            onDeleteItemFromWishList={onDeleteItemFromWishList}
            onAddOptionToPurchaseList={onAddOptionToPurchaseList}
            onSelect={onSelect}
            onUnSelect={onUnSelect}
            isChecked={selectionList.includes(item.id)}
          />
        ))}
      </Card>

      <Card title="Purchase List" className="align-left margin-top-1rem">
        {purchaseList.map(item =>
          item.options.map((
            option // item의 모든 option마다 Choice Component를 하나씩 Render한다.
          ) => (
            <Choice
              item={{ ...item, options: [option] }}
              key={option.id}
              onDeleteOptionFromPurchaseList={onDeleteOptionFromPurchaseList}
            />
          ))
        )}
      </Card>

      <BackTop visibilityHeight={0} />

      <Affix offsetBottom={30}>
        <div>
          <Alert
            message={`Total Price To Pay : 상품 가격(${totalPrice -
              totalShippingFee}) + 배송료(${totalShippingFee}) = ${totalPrice}`}
            type="info"
            className="width-fourth-center ShoppingCart-normal-item"
          />
          <Button
            className="margin-top-0-5rem"
            type="primary"
            onClick={onPurchase}
          >
            Purchase the Items In Purchase List
          </Button>
        </div>
      </Affix>
    </div>
  );
};

export default ShoppingCart;
