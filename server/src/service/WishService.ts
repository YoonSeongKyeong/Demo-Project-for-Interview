/* eslint-disable @typescript-eslint/camelcase */
import { getRepository, Repository } from 'typeorm';
import { Wish } from '../entity/Wish';
import {
  WishService_GetItemIdListOfUserOutput,
  WishService_GetItemIdListOfUserInput,
  CreateWishEntity,
  WishService_DeleteItemIdListOfUserInput,
  WishService_DeleteItemIdListOfUserOutput,
  WishService_AddItemIdListOfUserReturnsValidOneInput,
  WishService_AddItemIdListOfUserReturnsValidOneOutput,
} from '../interface/serversideSpecific';
import { User } from '../entity/User';
import { Item } from '../entity/Item';

export class WishService {
  // WishService는 Item, User를 연결하는 Wish라는 JoinTable의 Service를 제공한다.
  wishRepository: Repository<Wish>;
  userRepository: Repository<User>;
  itemRepository: Repository<Item>;
  constructor() {
    this.wishRepository = getRepository(Wish);
    this.userRepository = getRepository(User);
    this.itemRepository = getRepository(Item);
  }

  getItemIdListOfUser = async ({
    userId,
  }: WishService_GetItemIdListOfUserInput): Promise<WishService_GetItemIdListOfUserOutput> => {
    const getItemIdObj = await this.wishRepository
      .createQueryBuilder('wish')
      .select('wish.item.id', 'id')
      .where(`wish.user.id = :userId`, { userId })
      .getRawMany();
    return getItemIdObj.map(idObj => idObj.id);
  };

  addItemIdListOfUserReturnsValidOne = async ({
    itemIdList,
    userId,
  }: WishService_AddItemIdListOfUserReturnsValidOneInput): Promise<
    WishService_AddItemIdListOfUserReturnsValidOneOutput
  > => {
    if (itemIdList.length === 0) {
      // 만약 itemIdList가 비어있다면 추가 작업이 필요 없으므로 바로 return한다.
      return [];
    }
    const [getItemIdObj, getUserById] = await Promise.all([
      await this.wishRepository // 유저 장바구니에 등록된 싱픔 Id 리스트 와 유저 객체를 가져온다.
        .createQueryBuilder('wish')
        .select('wish.item.id', 'id')
        .where(`wish.user.id = :userId`, { userId })
        .getRawMany(),
      await this.userRepository.findOne({ id: userId }),
    ]);
    if (!getUserById) {
      throw new Error('Invalid User Id');
    }
    const itemIdListToAdd = [...itemIdList];
    for (const itemIdObj of getItemIdObj) {
      // 새로 추가할 상품 id에서 이미 장바구니에 있는 id는 제거한다.
      const indexOfDuplicate = itemIdListToAdd.indexOf(itemIdObj.id);
      if (indexOfDuplicate != -1) {
        itemIdListToAdd.splice(indexOfDuplicate, 1);
      }
    }
    let getListOfItemsToAdd: Item[];
    try {
      // 장바구니의 추가할 id가 valid한지 확인하고, wish에 user와 연결할 item을 가져온다.
      getListOfItemsToAdd = await Promise.all(
        itemIdListToAdd.map(itemId =>
          this.itemRepository.findOne({ id: itemId }).then(item => {
            if (!item) {
              return null; // 유효하지 않은 Item의 Id를 제거한다.
            }
            return item;
          }),
        ),
      ).then(items => items.filter(item => item !== null) as Item[]);
    } catch (error) {
      throw error;
    }
    await Promise.all(
      // User와 Item을 연결하는 Wish를 생성한다.
      getListOfItemsToAdd.map(item => {
        const newWish: CreateWishEntity = {
          item: item,
          user: getUserById,
        };
        return this.wishRepository.save(newWish);
      }),
    );
    return getListOfItemsToAdd.map(item => item.id); // 유효한 상품들의 itemIdList를 다시 전송한다.
  };
  deleteItemIdListOfUser = async ({
    itemIdList,
    userId,
  }: WishService_DeleteItemIdListOfUserInput): Promise<
    WishService_DeleteItemIdListOfUserOutput
  > => {
    if (itemIdList.length === 0) {
      // 만약 itemIdList가 비어있다면 제거 작업이 필요 없으므로 바로 return한다.
      return;
    }
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where(`user.id = ${userId} AND (item.id = ${itemIdList.join(` OR item.id = `)})`) // UserId와 유저id가 같으면서 제출한 ItemId와 상품id가 같은 모든 Wish를 지운다.
      .execute();
  };
}
