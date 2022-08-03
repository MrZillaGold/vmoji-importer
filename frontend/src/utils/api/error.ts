export enum APIErrorCode {
    /**
     * User authorization failed
     *
     * Code: `5`
     */
    AUTH = 5
}

export interface IAPIError {
    error_code: APIErrorCode | number;
    error_msg: string;
}

export class APIError extends Error {

    readonly code: IAPIError['error_code'];
    readonly name: string;

    constructor({ error_code, error_msg }: IAPIError) {
        super(error_msg);

        this.name = this.constructor.name;
        this.code = error_code;
    }

    get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    toJSON(): any {
        return this;
    }
}
