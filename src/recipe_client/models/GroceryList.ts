/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroceryListItem } from './GroceryListItem';

export type GroceryList = {
    id: number;
    extra_items?: string;
    user_id: number;
    grocery_list_items: Array<GroceryListItem>;
};

