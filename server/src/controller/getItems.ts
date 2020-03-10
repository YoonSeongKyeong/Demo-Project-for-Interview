import { Request, Response } from 'express';
import { GetItemsReq, GetItemsRes } from '../interface/api';

// 상품 불러오기

export async function getItems(request: Request, response: Response): Promise<void> {
  debugger;
  let reqBody: GetItemsReq;
  let resBody: GetItemsRes;

  try {
    const { q, offset, limit } = request.query; // interface 외의 정보 제거
    reqBody = { q, offset, limit };

    // ItemService를 이용해서 요청한 조건의 Item 정보를 모두 불러온다. (Provider, Shipping 및 Options 정보를 같이 불러온다.)
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
