/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/camelcase */
// 깔끔한 이름 작명을 위해서 eslint을 비활성화합니다.

// This Files contain high level dependency for checking what to fix when entity have change
// 엔티티 변경시 : 우클릭 + Find All Reference 로 변경 가능성이 있는 후보 목록 확인

export interface Item_Dependency {} // indicates the interfaces to check when Item entity have changes.
export interface Option_Dependency {} // indicates the interfaces to check when Option entity have changes.
export interface Provider_Dependency {} // indicates the interfaces to check when Provider entity have changes.
export interface Purchased_Dependency {} // indicates the interfaces to check when Purchased entity have changes.
export interface Shipping_Dependency {} // indicates the interfaces to check when Shipping entity have changes.
export interface User_Dependency {} // indicates the interfaces to check when User entity have changes.
export interface Wish_Dependency {} // indicates the interfaces to check when Wish entity have changes.
