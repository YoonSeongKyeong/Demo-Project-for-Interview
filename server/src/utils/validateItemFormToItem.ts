import {
  ValidateItemFormToItemInput,
  ValidateItemFormToItemOutput,
} from 'src/interface/serversideSpecific';

export const validateItemFormToItem = ({
  itemForm,
  item,
}: ValidateItemFormToItemInput): ValidateItemFormToItemOutput => {
  if (
    // 기본 사항 비교
    itemForm.id !== item.id ||
    itemForm.price !== item.price ||
    itemForm.shipping.method !== item.shipping.method ||
    itemForm.provider !== item.provider.name
  ) {
    return false;
  }
  // 구매 옵션 비교
  for (const buyOption of itemForm.options) {
    let isThereMatchingOption = false;
    for (const itemOption of itemForm.options) {
      // 제출한 option과 대응되는 상품 option을 찾은 경우
      if (buyOption.id === itemOption.id) {
        if (
          // invalid option
          buyOption.color !== itemOption.color ||
          buyOption.id !== itemOption.id ||
          buyOption.size !== itemOption.size ||
          buyOption.stock > itemOption.stock
        ) {
          return false;
        }
        isThereMatchingOption = true;
      }
    }
    if (!isThereMatchingOption) {
      // 대응되는 상품 option이 없는 경우
      return false;
    }
  }
  // 모든 기준을 충족하는 경우
  return true;
};
