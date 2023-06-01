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
     * @param sort
     * @param name
     * @param imageUrl
     * @param thumbnailUrl
     * @param source
     * @param servings
     * @param servingsType
     * @param prepTime
     * @param cookTime
     * @param description
     * @param nutrition
     * @param favorite
     * @param page
     * @param size
     * @returns Page_Recipe_ Successful Response
     * @throws ApiError
     */
    public recipesListRecipes(
        sort: string = 'alpha',
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
        page: number = 1,
        size: number = 50,
    ): CancelablePromise<Page_Recipe_> {
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
     * @param requestBody
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public recipesCreateRecipe(
        requestBody: RecipeCreate,
    ): CancelablePromise<Recipe> {
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
     * @param id
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public recipesGetRecipe(
        id: number,
    ): CancelablePromise<Recipe> {
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
     * @param id
     * @param requestBody
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public recipesUpdateRecipe(
        id: number,
        requestBody: RecipeUpdate,
    ): CancelablePromise<Recipe> {
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
     * @param id
     * @returns Recipe Successful Response
     * @throws ApiError
     */
    public recipesDeleteRecipe(
        id: number,
    ): CancelablePromise<Recipe> {
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
