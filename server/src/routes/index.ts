/**
 * All application routes.
 */

export const AppRoutes = [
  {
    path: '/api/items',
    method: 'get',
    action: getItems,
  },
  {
    path: '/api/mycart',
    method: 'get',
    action: getMyCart,
  },
  {
    path: '/api/mycart',
    method: 'put',
    action: putMyCart,
  },
  {
    path: '/api/items/purchase',
    method: 'post',
    action: purchaseItems,
  },
];
