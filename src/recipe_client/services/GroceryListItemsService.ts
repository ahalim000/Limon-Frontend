/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GroceryListItemsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Toggle Grocery List Item
     * @returns void
     * @throws ApiError
     */
    public toggleGroceryListItem({
        id,
    }: {
        id: number,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/grocery_list_items/{id}/toggle',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
