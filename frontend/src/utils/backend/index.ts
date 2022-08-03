import axios from 'axios';

import { BackendError } from './error';
import { AuthMethod, StickersMethod } from './methods';
import { APIOptions, RequestOptions, APIErrorResponse } from './types';

import { BACKEND_ENDPOINT } from '../../constants';

export enum BackendMethod {
    AUTH = 'auth',
    STICKERS = 'stickers'
}

const endpoints = Object.values(BackendMethod);

export class Backend {

    static ENDPOINT = BACKEND_ENDPOINT;

    protected serializeErrors = true;

    readonly auth!: AuthMethod;
    readonly stickers!: StickersMethod;

    constructor(options?: APIOptions) {
        if (options) {
            Object.entries(options)
                .forEach(([key, value]) => {
                    // @ts-ignore
                    this[key] = value;
                });
        }

        for (const endpoint of endpoints) {
            this[endpoint] = new Proxy(Object.create(null), {
                get: (_, method: string) => (params: any): Promise<unknown> => (
                    this.#request({
                        endpoint,
                        method,
                        params
                    })
                )
            });
        }
    }

    get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    #request({ endpoint, method, params = {} }: RequestOptions): Promise<any> {
        const url = new URL(`/${endpoint}.${method}`, Backend.ENDPOINT)
            .toString();

        return axios.post<any>(url, params)
            .then(({ data }) => data)
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    const errorData = error.response?.data as APIErrorResponse;

                    if (this.serializeErrors) {
                        throw new BackendError(error.response?.data as APIErrorResponse);
                    }

                    return errorData;
                }

                throw error;
            });
    }
}

export const backend = new Backend();

export * from './error';
