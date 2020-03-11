import { ItemForm } from 'src/interface/api';

interface BundleFeeObj {
  [provider: string]: {
    lowestShippingFee: number;
  };
}

const nameForFreeShippingMethod = 'FREE';

export const getTotalPriceByItemFormList = (
  itemFormList: ItemForm[],
): { totalPrice: number; totalShippingFee: number } => {
  // 이미 상품 가격이 검증된 것을 가정하고, itemFormList의 total Price를 계산한다.
  let totalPrice = 0;
  let totalShippingFee = 0;
  const bundleFeeObj: BundleFeeObj = {};
  for (const itemForm of itemFormList) {
    let shouldShip = false;
    for (const option of itemForm.options) {
      if (option.stock > 0) {
        totalPrice += option.stock * itemForm.price;
        shouldShip = true;
      }
    } // 같은 상품에 대해서는 옵션이 다르더라도 모두 한번에 배송한다고 생각한다.

    const { method: shippingMethod, price: shippingFee, canBundle } = itemForm.shipping;

    if (shouldShip) {
      if (!canBundle) {
        // bundle 불가능하면 바로 계산
        const fee = shippingMethod === nameForFreeShippingMethod ? 0 : shippingFee;
        totalPrice += fee;
        totalShippingFee += fee;
      } else {
        // bundle 가능한 경우 일단 등록
        const { provider } = itemForm;
        if (bundleFeeObj[provider] === undefined) {
          bundleFeeObj[provider] = {
            lowestShippingFee: shippingFee,
          };
        } else if (bundleFeeObj[provider].lowestShippingFee > shippingFee) {
          // 최소 bundle 배송비 갱신
          bundleFeeObj[provider].lowestShippingFee = shippingFee;
        }
      }
    }
  }
  for (const provider in bundleFeeObj) {
    // 최소 bundleFee로 계산
    const bundleFee = bundleFeeObj[provider].lowestShippingFee;
    totalPrice += bundleFee;
    totalShippingFee += bundleFee;
  }
  return { totalPrice, totalShippingFee };
};
