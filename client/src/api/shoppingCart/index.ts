import Axios from '../config';
import { AxiosResponse } from 'axios';
import {
  GetMyCartRes,
  DeleteMyCartReq,
  DeleteMyCartRes,
  ItemForm,
  PurchaseItemReq,
  PurchaseItemRes,
} from '../../interface/api';

export const getItemsFromMyCart = async () => {
  try {
    const {
      data: { goods: items },
    }: AxiosResponse<GetMyCartRes> = await Axios.get(`api/mycart`, {
      withCredentials: true,
    });
    return items;
  } catch (error) {
    throw error;
  }
};

export const deleteItemIdListFromWishList = async (itemIdList: number[]) => {
  const reqBody: DeleteMyCartReq = {
    itemIdList,
  };
  try {
    const {
      data: { isSuccess },
    }: AxiosResponse<DeleteMyCartRes> = await Axios.post(
      `api/mycart/delete`,
      reqBody,
      {
        withCredentials: true,
      }
    );
    if (!isSuccess) {
      // !ISSUE 나중에 어떤 오류로 requset가 성공하지 못했는지 message를 추가해서 알리는 게 좋다.
      throw new Error('Error in deleting item from wish list');
    }
    alert('장바구니에서 상품이 성공적으로 삭제되었습니다!');
    return;
  } catch (error) {
    throw error;
  }
};

export const purchaseItems = async (itemForm: ItemForm[]) => {
  const reqBody: PurchaseItemReq = {
    goods: itemForm,
  };
  try {
    const {
      data: { isSuccess, price },
    }: AxiosResponse<PurchaseItemRes> = await Axios.post(
      `api/items/purchase`,
      reqBody,
      {
        withCredentials: true,
      }
    );
    if (!isSuccess) {
      // !ISSUE 나중에 어떤 오류로 requset가 성공하지 못했는지 message를 추가해서 알리는 게 좋다.
      throw new Error('Error in deleting item from wish list');
    }
    alert(`상품 구매가 성공했습니다! 총 가격은 ${price} 입니다.`);
    return price;
  } catch (error) {
    alert(`상품 구매가 실패했습니다.`);
    throw error;
  }
};
