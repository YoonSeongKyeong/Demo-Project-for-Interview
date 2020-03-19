import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert, Tooltip, Input, BackTop } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { RootState } from '../../modules';
import {
  addItemToWishListThunk,
  getMoreItemsThunk,
  searchItemsThunk,
} from '../../modules/itemList';
import Item from '../../components/ItemList_Item';
import './style.css';

const { Search } = Input;
// ItemList에서는 검색 기능을 제공한다.
// ItemList에서는 infinite scroll로 상품 리스트를 받아오는 기능을 제공한다.
// ItemList_Item: 상품 이미지, 상품 이름, 판매자 이름, 가격 등을 볼 수 있고, 장바구니에 추가 기능을 이용할 수 있다. (!ISSUE: 장바구니에서 상품 id 유출을 막기 위해 장바구니 토큰을 read할 수 없게 만들어서 클라이언트는 상품이 장바구니에 담겼는지 여부를 모른다. 이 부분에 대해 상의가 필요하다.)
// backToHome: 홈으로 돌아간다.

const ItemList: React.FC = () => {
  // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
  const items = useSelector((state: RootState) => state.itemList.items);
  const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다

  // 각 액션들을 디스패치하는 함수들을 만들어줍니다
  const onAddItemToWishList = (id: number) => {
    // 각 Item에서 장바구니 추가 버튼에 적용
    dispatch(addItemToWishListThunk(id));
  };

  const onGetMoreItems = () => {
    // componentDidMount와 scroll할 때 적용
    dispatch(getMoreItemsThunk());
  };

  const onSearch = (query: string) => {
    // search할 때 적용
    dispatch(searchItemsThunk(query));
  };

  window.onscroll = debounce(() => {
    let marginToStartLoad = 100;
    // infinite scroll
    if (
      document.documentElement.clientHeight +
        document.documentElement.scrollTop +
        marginToStartLoad >=
      document.documentElement.scrollHeight
    ) {
      onGetMoreItems();
    }
  }, 100);

  useEffect(() => {
    onGetMoreItems();
  }, []);

  return (
    <div className="text-center align-center">
      <Alert
        message="ItemList"
        type="info"
        className="width-third-center ItemList-normal-item"
      />

      <Tooltip title="Home">
        <Link to="/">
          <Button
            className="ItemList-normal-item"
            type="danger"
            shape="circle"
            icon={<HomeFilled />}
          />
        </Link>
      </Tooltip>

      <div>
        <Search
          className="width-third-center ItemList-normal-item"
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={value => {
            onSearch(value);
            value = '';
          }}
        />
      </div>

      {items.map(item => (
        <Item
          onAddItemToWishList={onAddItemToWishList}
          item={item}
          key={item.id}
        />
      ))}

      <BackTop visibilityHeight={0} />
    </div>
  );
};

export default ItemList;
