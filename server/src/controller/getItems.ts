import { Request, Response } from 'express';
import { GetItemsReq, GetItemsRes, ItemForm } from '../interface/api';
import { ItemService } from '../service/ItemService';

// 상품 불러오기

export async function getItems(request: Request, response: Response): Promise<void> {
  let reqBody: GetItemsReq;
  let resBody: GetItemsRes;

  const itemService = new ItemService();
  try {
    const { q, offset, limit } = request.query; // interface 외의 정보 제거
    reqBody = { q, offset, limit };
    // ItemService를 이용해서 요청한 조건의 Item 정보를 모두 불러온다. (Provider, Shipping 및 Options 정보를 같이 불러온다.)
    const goods: ItemForm[] = await itemService.getItemFormListByCriteria(reqBody);
    resBody = { goods };
    response.status(200).json(resBody);
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
