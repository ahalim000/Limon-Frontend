/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Page_Recipe_ } from '../models/Page_Recipe_';
import type { Recipe } from '../models/Recipe';
import type { RecipeCreate } from '../models/RecipeCreate';
import type { RecipeUpdate } from '../models/RecipeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RecipesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List Recipes
     * @returns Page_Recipe_ Successful Response
     * @throws ApiError
     */
    public listRecipes({
        sort = 'alpha',
        name,
        imageUrl,
        thumbnailUrl,
        source,
        servings,
        servingsType,
        prepTime,
        cookTime,
        description,
        nutrition,
        favorite,
        page = 1,
        size = 50,
    }: {
        sort?: string,
        name?: string,
        imageUrl?: string,
        thumbnailUrl?: string,
        source?: string,
        servings?: number,
        servingsType?: string,
        prepTime?: number,
        cookTime?: number,
        description?: string,
        nutrition?: string,
        favorite?: boolean,
        page?: number,
        size?: number,
    }): CancelablePromise<Page_Recipe_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes',
            query: {
                'sort': sort,
                'name': name,
                'image_url': imageUrl,
                'thumbnail_url': thumbnailUrl,
                'source': source,
                'servings': servings,
                'servings_type': servingsType,
                'prep_time': prepTime,
                'cook_time': cookTime,
                'description': description,
                'nutrition': nutrition,
                'favorite': favorite,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Recipe
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public createRecipe({
        requestBody,
    }: {
        requestBody: RecipeCreate,
    }): CancelablePromise<Recipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/recipes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Recipe
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public getRecipe({
        id,
    }: {
        id: number,
    }): CancelablePromise<Recipe> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/recipes/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Recipe
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public updateRecipe({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: RecipeUpdate,
    }): CancelablePromise<Recipe> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/recipes/{id}',
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
     * Delete Recipe
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public deleteRecipe({
        id,
    }: {
        id: number,
    }): CancelablePromise<Recipe> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/recipes/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
