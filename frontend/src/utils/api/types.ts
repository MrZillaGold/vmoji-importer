import { Method } from './';

export interface RequestOptions {
    endpoint: Method;
    method: string;
    params: any;
}
