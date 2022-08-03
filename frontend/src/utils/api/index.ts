import VKBridge from '@vkontakte/vk-bridge';

import { StoreMethods } from './methods';
import { RequestOptions } from './types';

import { getLaunchParams } from '../getLaunchParams';

export enum Method {
    STORE = 'store'
}

const endpoints = Object.values(Method);
const { language } = getLaunchParams();

export class API {

    static VERSION = '5.160';

    accessToken = '';

    readonly store!: StoreMethods;

    constructor(accessToken: string) {
        this.accessToken = accessToken;

        for (const endpoint of endpoints) {
            this[endpoint] = new Proxy(Object.create(null), {
                get: (_, method: string) => (params: any): Promise<any> => (
                    this.request({
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

    private request({ endpoint, method, params = {} }: RequestOptions): Promise<any> {
        params.v = API.VERSION;
        params.lang = language;
        params.access_token = this.accessToken;

        params = Object.fromEntries(
            Object.entries(params)
                .reduce<[string, any][]>((params, [key, value]) => {
                    if (typeof value !== 'undefined') {
                        switch (typeof value) {
                            case 'object':
                                if (Array.isArray(value)) {
                                    value = String(value);
                                } else {
                                    value = JSON.stringify(value);
                                }
                                break;
                        }

                        params.push([key, value]);
                    }

                    return params;
                }, [])
        );

        return VKBridge.send('VKWebAppCallAPIMethod', {
            method: `${endpoint}.${method}`,
            params
        })
            .then(({ response }) => response);
    }
}

export * from './error';
export * from './methods';
export * from './entities';
