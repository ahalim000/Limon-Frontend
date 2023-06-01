/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RecipeCreate = {
    name: string;
    image_url?: string;
    thumbnail_url?: string;
    source?: string;
    servings?: number;
    servings_type?: string;
    prep_time?: number;
    cook_time?: number;
    description?: string;
    nutrition?: string;
    favorite?: boolean;
    tag_ids?: Array<number>;
    steps?: Array<string>;
    ingredients?: Array<string>;
};

