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
     * @returns Page_MealPlanItem_ Successful Response
     * @throws ApiError
     */
    public listMealPlanItems({
        startDate,
        endDate,
        recipeId,
        date,
        servings,
        mealType,
        page = 1,
        size = 50,
    }: {
        startDate: string,
        endDate: string,
        recipeId?: number,
        date?: string,
        servings?: number,
        mealType?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<Page_MealPlanItem_> {
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
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public createMealPlanItem({
        requestBody,
    }: {
        requestBody: MealPlanItemCreate,
    }): CancelablePromise<MealPlanItem> {
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
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public getMealPlanItem({
        id,
    }: {
        id: number,
    }): CancelablePromise<MealPlanItem> {
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
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public updateMealPlanItem({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: MealPlanItemUpdate,
    }): CancelablePromise<MealPlanItem> {
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
     * @returns MealPlanItem Successful Response
     * @throws ApiError
     */
    public deleteMealPlanItem({
        id,
    }: {
        id: number,
    }): CancelablePromise<MealPlanItem> {
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
