/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { GroceryListItemsService } from './services/GroceryListItemsService';
import { GroceryListsService } from './services/GroceryListsService';
import { MealPlanItemsService } from './services/MealPlanItemsService';
import { RecipesService } from './services/RecipesService';
import { TagsService } from './services/TagsService';
import { TokenService } from './services/TokenService';
import { UsersService } from './services/UsersService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class RecipeClient {

    public readonly groceryListItems: GroceryListItemsService;
    public readonly groceryLists: GroceryListsService;
    public readonly mealPlanItems: MealPlanItemsService;
    public readonly recipes: RecipesService;
    public readonly tags: TagsService;
    public readonly token: TokenService;
    public readonly users: UsersService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.groceryListItems = new GroceryListItemsService(this.request);
        this.groceryLists = new GroceryListsService(this.request);
        this.mealPlanItems = new MealPlanItemsService(this.request);
        this.recipes = new RecipesService(this.request);
        this.tags = new TagsService(this.request);
        this.token = new TokenService(this.request);
        this.users = new UsersService(this.request);
    }
}

