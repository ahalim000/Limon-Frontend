/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Page_User_ } from '../models/Page_User_';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserUpdate } from '../models/UserUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List Users
     * @returns Page_User_ Successful Response
     * @throws ApiError
     */
    public listUsers({
        username,
        role,
        page = 1,
        size = 50,
    }: {
        username?: string,
        role?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<Page_User_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users',
            query: {
                'username': username,
                'role': role,
                'page': page,
                'size': size,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create User
     * @returns User Successful Response
     * @throws ApiError
     */
    public createUser({
        requestBody,
    }: {
        requestBody: UserCreate,
    }): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User Self
     * @returns User Successful Response
     * @throws ApiError
     */
    public getUserSelf(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users/me',
        });
    }

    /**
     * Update User
     * @returns User Successful Response
     * @throws ApiError
     */
    public updateUser({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UserUpdate,
    }): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/users/{id}',
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

}
