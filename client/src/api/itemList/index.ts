import Axios from '../config';
import { AxiosResponse } from 'axios';
import {
  GetItemsReq,
  GetItemsRes,
  PostMyCartReq,
  PostMyCartRes,
} from '../../interface/api';

export const postItemIdToWishList = async (itemId: number) => {
  const reqBody: PostMyCartReq = {
    itemIdList: [itemId],
  };
  try {
    const {
      data: { isSuccess },
    }: AxiosResponse<PostMyCartRes> = await Axios.post(`api/mycart`, reqBody, {
      withCredentials: true,
    });
    if (!isSuccess) {
      // !ISSUE 나중에 어떤 오류로 requset가 성공하지 못했는지 message를 추가해서 알리는 게 좋다.
      throw new Error('Error in adding item to wish list');
    }
    alert('장바구니에 상품이 성공적으로 추가되었습니다!');
    return;
  } catch (error) {
    throw error;
  }
};

export const getItems = async ({
  q = '',
  offset = '0',
  limit = '20',
}: GetItemsReq) => {
  try {
    const {
      data: { goods: items },
    }: AxiosResponse<GetItemsRes> = await Axios.get(
      `api/items?q=${q}&offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
    return items;
  } catch (error) {
    throw error;
  }
};
