/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroceryList } from '../models/GroceryList';
import type { GroceryListCreate } from '../models/GroceryListCreate';
import type { GroceryListUpdate } from '../models/GroceryListUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GroceryListsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Grocery List
     * @returns GroceryList Successful Response
     * @throws ApiError
     */
    public createGroceryList({
        requestBody,
    }: {
        requestBody: GroceryListCreate,
    }): CancelablePromise<GroceryList> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/grocery_lists',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Grocery List
     * @returns GroceryList Successful Response
     * @throws ApiError
     */
    public getGroceryList({
        id,
    }: {
        id: number,
    }): CancelablePromise<GroceryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/grocery_lists/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Grocery List
     * @returns GroceryList Successful Response
     * @throws ApiError
     */
    public updateGroceryList({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: GroceryListUpdate,
    }): CancelablePromise<GroceryList> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/grocery_lists/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Grocery List
     * @returns GroceryList Successful Response
     * @throws ApiError
     */
    public deleteGroceryList({
        id,
    }: {
        id: number,
    }): CancelablePromise<GroceryList> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/grocery_lists/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
