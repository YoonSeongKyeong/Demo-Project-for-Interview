import { ItemForm } from '../../interface/api';
import { createReducer } from 'typesafe-actions';
import { ShoppingCartAction } from './actions';
import {
  GET_ITEMS_FROM_WISHLIST,
  GET_ITEMS_FROM_WISHLIST_SUCCESS,
  GET_ITEMS_FROM_WISHLIST_ERROR,
  DELETE_ITEMS_FROM_WISHLIST,
  DELETE_ITEMS_FROM_WISHLIST_SUCCESS,
  DELETE_ITEMS_FROM_WISHLIST_ERROR,
  PURCHASE_ITEMS,
  PURCHASE_ITEMS_SUCCESS,
  PURCHASE_ITEMS_ERROR,
  ADD_OPTION_TO_PURCHASELIST,
  DELETE_OPTION_FROM_PURCHASELIST,
} from './types';

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
export type ShoppingCartState = {
  requestStatus: {
    // OK | LOADING | ERROR
    GET_ITEMS_FROM_WISHLIST: string;
    DELETE_ITEMS_FROM_WISHLIST: string;
    PURCHASE_ITEMS: string;
  };
  wishList: ItemForm[]; // 장바구니 상품 리스트
  purchaseList: ItemForm[]; // 구매 Option 리스트
};

// 초기상태를 선언합니다.
const initialState: ShoppingCartState = {
  requestStatus: {
    GET_ITEMS_FROM_WISHLIST: 'OK',
    DELETE_ITEMS_FROM_WISHLIST: 'OK',
    PURCHASE_ITEMS: 'OK',
  },
  wishList: [],
  purchaseList: [],
};

// 리듀서를 만듭니다
// createReducer 는 리듀서를 쉽게 만들 수 있게 해주는 함수입니다.
const itemList = createReducer<ShoppingCartState, ShoppingCartAction>(
  initialState,
  {
    [GET_ITEMS_FROM_WISHLIST]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        GET_ITEMS_FROM_WISHLIST: 'LOADING',
      },
    }),
    [GET_ITEMS_FROM_WISHLIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        GET_ITEMS_FROM_WISHLIST: 'OK',
      },
      wishList: [...payload],
    }),
    [GET_ITEMS_FROM_WISHLIST_ERROR]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        GET_ITEMS_FROM_WISHLIST: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
      },
    }),
    [DELETE_ITEMS_FROM_WISHLIST]: (state, action) => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        DELETE_ITEMS_FROM_WISHLIST: 'LOADING',
      },
      wishList: state.wishList.filter(
        item => !action.payload.includes(item.id)
      ),
    }),
    [DELETE_ITEMS_FROM_WISHLIST_SUCCESS]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        DELETE_ITEMS_FROM_WISHLIST: 'OK',
      },
    }),
    [DELETE_ITEMS_FROM_WISHLIST_ERROR]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        DELETE_ITEMS_FROM_WISHLIST: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
      },
    }),
    [PURCHASE_ITEMS]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        PURCHASE_ITEMS: 'LOADING',
      },
    }),
    [PURCHASE_ITEMS_SUCCESS]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        PURCHASE_ITEMS: 'OK',
      },
      purchaseList: [],
    }),
    [PURCHASE_ITEMS_ERROR]: state => ({
      ...state,
      requestStatus: {
        ...state.requestStatus,
        PURCHASE_ITEMS: 'ERROR', // !ISSUE 이후 ERROR에 대한 Handling Action 필요
      },
    }),
    [ADD_OPTION_TO_PURCHASELIST]: (
      state,
      {
        payload: {
          targetItem,
          option: { id, color, size, stock },
        },
      }
    ) => {
      debugger;
      const newOption = { id, color, size, stock };
      let newPurchaseList = [];
      let isItemFound = false;
      for (let item of state.purchaseList) {
        // 새option이 속한 item이 이미 purchaseList에 있는지 확인한다.
        if (item.id !== targetItem.id) {
          newPurchaseList.push(item);
        } else {
          let newOptionList = [];
          isItemFound = true;
          let isOptionFound = false;
          for (let option of item.options) {
            // 새 option이 이미 item의 options 안에 있는지 확인한다.
            if (option.id !== id) {
              newOptionList.push(option);
            } else {
              isOptionFound = true;
              newOptionList.push(newOption);
            }
          }
          if (!isOptionFound) {
            // options 안에 없으면 새 option을 추가한다.
            newOptionList.push(newOption);
          }
          let newItem = { ...item, options: newOptionList };
          newPurchaseList.push(newItem);
        }
      }
      if (!isItemFound) {
        // purchaseList 안에 없으면 새 item을 추가한다.
        let newItem = { ...targetItem, options: [newOption] };
        newPurchaseList.push(newItem);
      }
      return { ...state, purchaseList: newPurchaseList };
    },
    [DELETE_OPTION_FROM_PURCHASELIST]: (
      state,
      { payload: { itemId, optionId } }
    ) => ({
      ...state,
      purchaseList: state.purchaseList.map(item => {
        if (item.id !== itemId) {
          return item;
        }
        return {
          ...item,
          options: item.options.filter(option => option.id !== optionId),
        };
      }),
    }),
  }
);

export default itemList;
