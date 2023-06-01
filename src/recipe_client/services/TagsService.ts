/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Page_Tag_ } from '../models/Page_Tag_';
import type { Tag } from '../models/Tag';
import type { TagCreate } from '../models/TagCreate';
import type { TagUpdate } from '../models/TagUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TagsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List Tags
     * @returns Page_Tag_ Successful Response
     * @throws ApiError
     */
    public listTags({
        name,
        page = 1,
        size = 50,
    }: {
        name?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<Page_Tag_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/tags',
            query: {
                'name': name,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Tag
     * @returns Tag Successful Response
     * @throws ApiError
     */
    public createTag({
        requestBody,
    }: {
        requestBody: TagCreate,
    }): CancelablePromise<Tag> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/tags',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Tag
     * @returns Tag Successful Response
     * @throws ApiError
     */
    public updateTag({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: TagUpdate,
    }): CancelablePromise<Tag> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/tags/{id}',
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
     * Delete Tag
     * @returns Tag Successful Response
     * @throws ApiError
     */
    public deleteTag({
        id,
    }: {
        id: number,
    }): CancelablePromise<Tag> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/tags/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
