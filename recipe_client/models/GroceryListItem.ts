/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GroceryListItem = {
    id: number;
    grocery_list_id: number;
    active?: boolean;
    quantity: number;
    unit?: string;
    name: string;
    comment?: string;
    recipe_name: string;
    thumbnail_url?: string;
    servings: number;
    extra_items: boolean;
};

