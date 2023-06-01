/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Ingredient } from './Ingredient';
import type { Step } from './Step';
import type { Tag } from './Tag';

export type Recipe = {
    id: number;
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
    user_id: number;
    ingredients: Array<Ingredient>;
    steps: Array<Step>;
    tags: Array<Tag>;
};

