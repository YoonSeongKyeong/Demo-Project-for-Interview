import { deleteMyCart } from '../controller/deleteMyCart';
import { getItems } from '../controller/getItems';
import { getMyCart } from '../controller/getMyCart';
import { isSignIn } from '../controller/isSignIn';
import { postMyCart } from '../controller/postMyCart';
import { purchaseItems } from '../controller/purchaseItems';
import { signIn } from '../controller/signIn';
import { signOut } from '../controller/signOut';

/**
 * All application routes.
 */

export const AppRoutes = [
  {
    path: '/api/mycart/delete',
    method: 'post',
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
  {
    path: '/api/signIn',
    method: 'post',
    action: signIn,
  },
  {
    path: '/api/signOut',
    method: 'post',
    action: signOut,
  },
  {
    path: '/api/isSignIn',
    method: 'get',
    action: isSignIn,
  },
];
