/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/camelcase */
import { testFeatureObj } from '../tests/testFeatureObj';
import {
  CreateProviderEntity,
  CreateItemEntity,
  TestSetUp_ProviderObj,
  TestSetUp_ItemObj,
  TestSetUp_UserObj,
  TestSetUp_UserAuthObj,
  TestSetUp_PrepareTestDataOutput,
  CreateOptionEntity,
} from '../interface/serversideSpecific';
import { createProvider } from '../factory/ProviderFactory';
import { testImg } from '../tests/testImg';
import { createItem } from '../factory/ItemFactory';
import { createOption } from '../factory/OptionFactory';
import { createShipping } from '../factory/ShippingFactory';
import { createWish } from '../factory/WishFactory';
import { createUser } from '../factory/UserFactory';
import { signJWTForAuth } from './signJWT';
import { generateHash } from './encryptions';

export const prepareTestData = async (): Promise<TestSetUp_PrepareTestDataOutput> => {
  // Provider 생성
  const providerObj: TestSetUp_ProviderObj = {};

  let createProviderBaseForm: CreateProviderEntity = {
    name: '공급자 이름',
  };

  await Promise.all(
    testFeatureObj.Provider.map(async providerFeature => {
      const provider = await createProvider({
        ...createProviderBaseForm,
        ...providerFeature,
      });
      providerObj[provider.name] = provider; // providerObj에 name으로 등록
    }),
  );

  // Item 생성 (Options 및 Shipping도 같이 샏성된다.)
  const itemObj: TestSetUp_ItemObj = {}; // testFeature에 중복되는 상품 이름이 없어야 함

  let createItemBaseForm = {
    name: '상품 이름', //상품 이름
    titleImage: testImg, // 상품 대표 이미지
    price: -1, // 상품 가격
  };

  const createItemThenOptionsThenShippingPromiseList: Promise<void>[] = [];

  testFeatureObj.Item.forEach(itemsGroup => {
    createItemThenOptionsThenShippingPromiseList.push(
      ...itemsGroup.items.map(async ({ itemFeature, options, shipping }) => {
        const newItem: CreateItemEntity = {
          ...createItemBaseForm,
          ...itemFeature,
          provider: providerObj[itemsGroup.providerName],
        };

        let item = await createItem(newItem);
        itemObj[item.name] = item; // itemObj에 name으로 등록
        await Promise.all(
          options.map(async option => {
            const newOption: CreateOptionEntity = { ...option, item };
            return await createOption(newOption);
          }),
        );
        await createShipping({ ...shipping, item });
        return;
      }),
    );
  });
  await Promise.all(createItemThenOptionsThenShippingPromiseList);

  // User 생성
  const userObj: TestSetUp_UserObj = {};

  await Promise.all(
    testFeatureObj.User.map(async user => {
      userObj[user.email] = await createUser({
        ...user,
        password: await generateHash(user.password),
      });
    }),
  );

  // User의 Auth JWT Mapping 오브젝트 생성
  const userAuthObj: TestSetUp_UserAuthObj = {};
  for (let email in userObj) {
    let user = userObj[email];
    userAuthObj[email] = { user: user, auth: signJWTForAuth({ id: user.id }) };
  }

  // Wish 생성
  await Promise.all(
    testFeatureObj.Wish.map(
      async ({ itemInfo: { itemName }, userInfo: { email } }) =>
        await createWish({
          item: itemObj[itemName],
          user: userObj[email],
        }),
    ),
  );

  return { userAuthObj };
};
