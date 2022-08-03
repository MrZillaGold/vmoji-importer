import { FastifyError } from 'fastify';

import { CommonErrorCode, CommonErrorDescription, CommonErrorStatusCode } from './common';
import { StickersErrorCode, StickersErrorDescription, StickersErrorStatusCode } from '../routes';

export type APIErrorCode =
    CommonErrorCode
    | StickersErrorCode;
type APIErrorCodeUnion = `${APIErrorCode}`;

const errorDescriptions = new Map(
    Object.entries({
        ...CommonErrorDescription,
        ...StickersErrorDescription
    })
);

const errorStatusCode = new Map(
    Object.entries({
        ...CommonErrorStatusCode,
        ...StickersErrorStatusCode
    })
);

export interface SerializedAPIError {
    error: Pick<APIError, 'code' | 'status_code' | 'message'>;
}

export class APIError extends Error {

    name: string;
    code!: APIErrorCodeUnion;
    status_code!: number;

    constructor(code: APIErrorCode) {
        super();

        this.name = this.constructor.name;

        this.setCode(code);

        Error.captureStackTrace(this, this.constructor);
    }

    setCode(code: APIErrorCode): this {
        this.code = code;
        this.message = errorDescriptions.get(code)!;
        this.status_code = errorStatusCode.get(code)!;

        return this;
    }

    parse({ code, statusCode, message }: FastifyError): this {
        if (code) {
            this.code = code as APIErrorCodeUnion;
        }

        if (statusCode) {
            this.status_code = statusCode;
        }

        this.message = message;

        return this;
    }

    get statusCode(): APIError['status_code'] {
        return this.status_code;
    }

    get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    toJSON(): SerializedAPIError {
        const { name, ...error } = this;

        return {
            error
        };
    }
}

export * from './common';
