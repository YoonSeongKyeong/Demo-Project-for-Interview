/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRepository, Repository, Like } from 'typeorm';
import { Item } from '../entity/Item';
import {
  ItemService_GetItemFormListByCriteriaInput,
  ItemService_GetItemFormListByCriteriaOutput,
} from '../interface/serversideSpecific';
import { ItemForm, ItemForm_Option, ItemForm_Shipping } from '../interface/api';

export class ItemService {
  itemRepository: Repository<Item>;
  constructor() {
    this.itemRepository = getRepository(Item);
  }

  getItemFormListByCriteria = async (
    criteria: ItemService_GetItemFormListByCriteriaInput,
  ): Promise<ItemService_GetItemFormListByCriteriaOutput> => {
    let query = criteria.q;
    if (!!query) {
      query = '';
    }
    let offset = parseInt(criteria.offset);
    if (!!offset) {
      offset = 0;
    }
    let limit = parseInt(criteria.limit);
    if (!!limit) {
      limit = 20; // default items/page
    }
    const getItems = await this.itemRepository.find({
      relations: ['provider', 'options', 'shipping'],
      where: { name: Like(`%${query}%`) },
      skip: offset,
      take: limit,
    });
    return getItems.map(item => {
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
        titleImage: item.titleImage,
        price: item.price,
        provider: item.provider.name,
        options,
        shipping,
      };

      return itemForm;
    });
  };
}
