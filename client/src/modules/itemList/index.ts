// 액션 타입을 선언합니다
// 뒤에 as const 를 붙여줌으로써 나중에 액션 객체를 만들게 action.type 의 값을 추론하는 과정에서

import { ItemForm } from '../../interface/api';

// action.type 이 string 으로 추론되지 않고 'itemList/ADD_ITEM_TO_WISHLIST' 와 같이 실제 문자열 값으로 추론 되도록 해줍니다.
const ADD_ITEM_TO_WISHLIST = 'itemList/ADD_ITEM_TO_WISHLIST' as const;
const GET_MORE_ITEMS = 'itemList/GET_MORE_ITEMS' as const;
const SEARCH = 'itemList/SEARCH' as const;

// 액션 생성함수를 선언합니다
export const addItemToWishList = (id: number) => ({
  type: ADD_ITEM_TO_WISHLIST,
  payload: id,
});

export const getMoreItems = () => ({
  type: GET_MORE_ITEMS,
});

export const search = (query: string) => ({
  type: SEARCH,
  payload: query,
});

// 모든 액션 겍체들에 대한 타입을 준비해줍니다.
// ReturnType<typeof _____> 는 특정 함수의 반환값을 추론해줍니다
// 상단부에서 액션타입을 선언 할 떄 as const 를 하지 않으면 이 부분이 제대로 작동하지 않습니다.
type ItemListAction =
  | ReturnType<typeof addItemToWishList>
  | ReturnType<typeof getMoreItems>
  | ReturnType<typeof search>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type ItemListState = {
  items: ItemForm[]; // 상품 정보 리스트
  query: string; // 검색어
  page: number; // 페이지 번호
  limit: number; // 한 페이지 당 요청할 상품 개수
};

// 초기상태를 선언합니다.
const initialState: ItemListState = {
  items: [],
  query: '',
  page: 0,
  limit: 20,
};

// 리듀서를 작성합니다.
// 리듀서에서는 state 와 함수의 반환값이 일치하도록 작성하세요.
// 액션에서는 우리가 방금 만든 ItemListAction 을 타입으로 설정합니다.
function itemList(
  state: ItemListState = initialState,
  action: ItemListAction
): ItemListState {
  switch (action.type) {
    case ADD_ITEM_TO_WISHLIST:
    //   return { count: state.count + 1 };
    case GET_MORE_ITEMS:
    //   return { count: state.count - 1 };
    case SEARCH:
    //   return { count: state.count + action.payload };
    default:
      return state;
  }
}

export default itemList;
