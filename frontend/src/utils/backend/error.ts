import { APIErrorResponse } from './types';

export enum BackendErrorCode {
    ROOT_ERROR = 'ROOT_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNAVAILABLE_ENTITY_TOKEN_TYPE = 'UNAVAILABLE_ENTITY_TOKEN_TYPE'
}

export class BackendError extends Error {

    readonly code: BackendErrorCode;
    readonly statusCode: number;

    readonly payload: APIErrorResponse['error'];

    constructor({ error }: APIErrorResponse) {
        const { code, message, status_code } = error;

        super(`${code} - ${message}`);

        this.code = code;
        this.payload = error;
        this.statusCode = status_code;

        this.name = this.constructor.name;
    }

    get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    toJSON(): APIErrorResponse['error'] {
        return this.payload;
    }
}
