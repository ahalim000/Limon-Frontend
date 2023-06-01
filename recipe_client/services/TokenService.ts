/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_token_create_token } from '../models/Body_token_create_token';
import type { Token } from '../models/Token';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TokenService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Token
     * @param formData
     * @returns Token Successful Response
     * @throws ApiError
     */
    public tokenCreateToken(
        formData: Body_token_create_token,
    ): CancelablePromise<Token> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
