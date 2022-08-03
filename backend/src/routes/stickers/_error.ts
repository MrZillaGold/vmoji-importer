export enum StickersErrorCode {
    VMOJI_NOT_CREATED = 'VMOJI_NOT_CREATED'
}

export const StickersErrorDescription = <const>{
    [StickersErrorCode.VMOJI_NOT_CREATED]: 'Vmoji character not created'
};

export const StickersErrorStatusCode = <const>{
    [StickersErrorCode.VMOJI_NOT_CREATED]: 400
};
