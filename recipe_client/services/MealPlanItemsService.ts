/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MealPlanItem } from '../models/MealPlanItem';
import type { MealPlanItemCreate } from '../models/MealPlanItemCreate';
import type { MealPlanItemUpdate } from '../models/MealPlanItemUpdate';
import type { Page_MealPlanItem_ } from '../models/Page_MealPlanItem_';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MealPlanItemsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List Meal Plan Items
     * @param startDate
     * @param endDate
     * @param recipeId
     * @param date
     * @param servings
     * @param mealType
     * @param page
     * @param size
     * @returns Page_MealPlanItem_ Successful Response
     * @throws ApiError
     */
    public mealPlanItemsListMealPlanItems(
        startDate: string,
        endDate: string,
        recipeId?: number,
        date?: string,
        servings?: number,
        mealType?: string,
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<Page_MealPlanItem_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/meal_plan_items',
            query: {
                'start_date': startDate,
                'end_date': endDate,
                'recipe_id': recipeId,
                'date': date,
                'servings': servings,
                'meal_type': mealType,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Meal Plan Item
     * @param requestBody
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public mealPlanItemsCreateMealPlanItem(
        requestBody: MealPlanItemCreate,
    ): CancelablePromise<MealPlanItem> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/meal_plan_items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Meal Plan Item
     * @param id
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public mealPlanItemsGetMealPlanItem(
        id: number,
    ): CancelablePromise<MealPlanItem> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/meal_plan_items/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Meal Plan Item
     * @param id
     * @param requestBody
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public mealPlanItemsUpdateMealPlanItem(
        id: number,
        requestBody: MealPlanItemUpdate,
    ): CancelablePromise<MealPlanItem> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/meal_plan_items/{id}',
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
     * Delete Meal Plan Item
     * @param id
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public mealPlanItemsDeleteMealPlanItem(
        id: number,
    ): CancelablePromise<MealPlanItem> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/meal_plan_items/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
