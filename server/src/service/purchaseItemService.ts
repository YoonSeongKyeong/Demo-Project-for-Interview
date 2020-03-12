/* eslint-disable @typescript-eslint/camelcase */
import { getRepository, getConnection, Repository } from 'typeorm';
import { Purchased } from '../entity/Purchased';
import { User } from '../entity/User';
import { Item } from '../entity/Item';
import { Option } from '../entity/Option';
import { ItemForm } from '../interface/api';
import {
  PurchaseItemService_PurchaseByItemFormListAndUserIdOutput,
  PurchaseItemService_PurchaseByItemFormListAndUserIdInput,
  CreatePurchasedEntity,
} from '../interface/serversideSpecific';
import { getTotalPriceByItemFormList } from '../utils/getTotalPrice';
import { validateItemFormToItem } from '../utils/validateItemFormToItem';

export class PurchaseItemService {
  purchasedRepository: Repository<Purchased>;
  userRepository: Repository<User>;
  itemRepository: Repository<Item>;
  constructor() {
    this.purchasedRepository = getRepository(Purchased);
    this.userRepository = getRepository(User);
    this.itemRepository = getRepository(Item);
  }

  purchaseByItemFormListAndUserId = async ({
    itemFormList,
    userId,
  }: PurchaseItemService_PurchaseByItemFormListAndUserIdInput): Promise<
    PurchaseItemService_PurchaseByItemFormListAndUserIdOutput
  > => {
    itemFormList.sort((a, b) => a.id - b.id); // update 시 Deadlock을 방지하기 위해서 itemId 오름차순으로 sort한다.

    // 실제로는 외부 API를 사용할 것이므로 현재 구현한 것에서 변경이 필요할 것이다.
    // 상품 구매 form의 상품 정보가 구매 직전 상품 정보와 일치하지 않거나 재고보다 많은 양을 구매하려고 할 때 구매가 실패한다.
    // 결제모듈에 맞게 정합성을 엄격하게 체크하되, 고객이 상품 구매 마지막 단계에서 불편을 느끼지 않도록 유연한 디자인이 필요하다.
    // 재고에서 상품이 없을 시 실패 response를 보내지만, 추후 적용할 수 있는 방법은: 가능한 재고의 최대치만큼 재시도하는 방법 or 어떤 상품이 재고가 부족했는지 알려주는 방법 등을 적용할 수 있다.
    const { totalPrice } = getTotalPriceByItemFormList(itemFormList);

    const itemIdList = itemFormList.map((itemForm: ItemForm) => itemForm.id);

    // 중간에 item의 가격 및 shipping 옵션이 바뀌는 경우에 totalPrice가 invalid할 수 있다. 이 경우엔 상품 구매를 취소할지, 아니면 새로 바뀐 상품 가격으로 진행할지, 예전 상품 가격으로 결제를 진행하며 상품 가격 변경 시 판매자에게 양해를 부탁할지 결정해야 한다.
    await getConnection().transaction('READ COMMITTED', async transactionalEntityManager => {
      // READ COMMITTED 이상의 Isolation Level 필요
      const user = await transactionalEntityManager.findOne(User, { id: userId });
      if (!user) {
        throw new Error('Invalid User Id');
      }
      if (user.cash < totalPrice) {
        throw new Error('Insufficient Cash');
      }
      const items = await transactionalEntityManager.findByIds(Item, itemIdList, {
        relations: ['provider', 'shipping', 'options'],
      });
      for (let i = 0; i < itemFormList.length; i++) {
        // 각 itemForm에 대해 실제 item과 비교해서 유효성 테스트를 한 후 요청한 상품 개수만큼 재고에서 빼준다. ( Entity에 stock >= 0 제약조건을 걸어두어서 consistency가 보장된다. )
        const itemForm = itemFormList[i];
        const item = items[i];
        if (!validateItemFormToItem({ itemForm, item })) {
          // 추후 개발시, 함수 안에 여러 에러를 정의해서 어떤 부분이 invalid한지 throw해줄 수 있다.
          throw new Error('Invalid Item Form');
        }
        for (const option of itemForm.options) {
          await transactionalEntityManager.decrement(
            Option,
            { id: option.id },
            'stock',
            option.stock,
          );
          const newPurchase: CreatePurchasedEntity = {
            // !ISSUE: 추후에 구매자의 배송 예정지 및 상품 위치 등도 Purchased 객체에 추가할 필요가 있다.
            status: 'WAITING_FOR_SHIPPING', // 상품 상태
            optionLog: JSON.stringify(option), // 선택옵션 json
            shippingLog: JSON.stringify(item.shipping), // 선택배송방식 json
            sellerId: item.provider.id, // 공급자 id
            user,
            item,
          };
          await transactionalEntityManager.save(Purchased, newPurchase); // 구매 정보 생성
        }
      }
      await transactionalEntityManager.decrement(User, { id: user.id }, 'cash', totalPrice);
    });
    return {
      isSuccess: true,
      price: totalPrice,
    };
  };
}
