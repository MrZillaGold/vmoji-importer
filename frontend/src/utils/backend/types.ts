import { BackendErrorCode, BackendMethod } from './';

export interface RequestOptions {
    endpoint: BackendMethod;
    method: string;
    params: any;
}

export interface APIOptions {
    serializeErrors?: boolean;
}

export interface APIErrorResponse {
    error: {
        code: BackendErrorCode;
        message: string;
        status_code: number;
    };
}
