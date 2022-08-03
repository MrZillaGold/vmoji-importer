export enum CommonErrorCode {
    ROOT_ERROR = 'ROOT_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNAVAILABLE_ENTITY_TOKEN_TYPE = 'UNAVAILABLE_ENTITY_TOKEN_TYPE'
}

export const CommonErrorDescription = <const>{
    [CommonErrorCode.ROOT_ERROR]: 'Internal server error occurred',
    [CommonErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error occurred',
    [CommonErrorCode.UNAVAILABLE_ENTITY_TOKEN_TYPE]: 'Method not available for this token type'
};

export const CommonErrorStatusCode = <const>{
    [CommonErrorCode.ROOT_ERROR]: 400,
    [CommonErrorCode.INTERNAL_SERVER_ERROR]: 500,
    [CommonErrorCode.UNAVAILABLE_ENTITY_TOKEN_TYPE]: 400
};
