/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRepository, Repository, Like } from 'typeorm';
import { Item } from '../entity/Item';
import {
  ItemService_GetItemFormListByCriteriaInput,
  ItemService_GetItemFormListByCriteriaOutput,
  ItemService_GetItemFormListByItemIdListInput,
  ItemService_GetItemFormListByItemIdListOutput,
} from '../interface/serversideSpecific';
import { ItemForm, ItemForm_Option, ItemForm_Shipping } from '../interface/api';

export class ItemService {
  itemRepository: Repository<Item>;
  constructor() {
    this.itemRepository = getRepository(Item);
  }

  private ConvertItemEntityListToItemFormList = (items: Item[]): ItemForm[] => {
    const itemFormList = items.map(item => {
      // item form 작성, 필요한 property만 추출
      const options = item.options.map(option => {
        const { id, color, size, stock } = option;
        const optionForm: ItemForm_Option = {
          id,
          color,
          size,
          stock,
        };
        return optionForm;
      });
      const { method, price, canBundle } = item.shipping;
      const shipping: ItemForm_Shipping = {
        method,
        price,
        canBundle,
      };
      const itemForm: ItemForm = {
        id: item.id,
        name: item.name,
        titleImage: Buffer.from(item.titleImage).toString('base64'), // Blob -> Base64
        price: item.price,
        provider: item.provider.name,
        options,
        shipping,
      };

      return itemForm;
    });
    itemFormList.sort((a, b) => a.id - b.id); // 오름차순 보장
    return itemFormList;
  };

  getItemFormListByCriteria = async (
    criteria: ItemService_GetItemFormListByCriteriaInput,
  ): Promise<ItemService_GetItemFormListByCriteriaOutput> => {
    let query = criteria.q;
    if (!query) {
      query = '';
    }
    let offset = !!criteria.offset ? parseInt(criteria.offset) : false;
    if (!offset) {
      offset = 0;
    }
    let limit = !!criteria.limit ? parseInt(criteria.limit) : false;
    if (!limit || limit <= 0) {
      limit = 20; // default items/page
    }
    const getItems = await this.itemRepository.find({
      relations: ['provider', 'options', 'shipping'],
      where: { name: Like(`%${query}%`) },
      skip: offset * limit,
      take: limit,
    });
    return this.ConvertItemEntityListToItemFormList(getItems);
  };

  getItemFormListByItemIdList = async (
    itemIdList: ItemService_GetItemFormListByItemIdListInput,
  ): Promise<ItemService_GetItemFormListByItemIdListOutput> => {
    if (itemIdList.length === 0) {
      // 만약 itemIdList가 비어있다면 바로 빈 배열을 return한다.
      return Promise.resolve([]);
    }
    const getItems = await this.itemRepository.find({
      relations: ['provider', 'options', 'shipping'],
      where: itemIdList.map(id => ({ id })),
    });
    return this.ConvertItemEntityListToItemFormList(getItems);
  };
}
