import { deleteMyCart } from '../controller/deleteMyCart';
import { getItems } from '../controller/getItems';
import { getMyCart } from '../controller/getMyCart';
import { postMyCart } from '../controller/postMyCart';
import { purchaseItems } from '../controller/purchaseItems';

/**
 * All application routes.
 */

export const AppRoutes = [
  {
    path: '/api/mycart',
    method: 'delete',
    action: deleteMyCart,
  },
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
    method: 'post',
    action: postMyCart,
  },
  {
    path: '/api/items/purchase',
    method: 'post',
    action: purchaseItems,
  },
];
