import { Type } from '@sinclair/typebox';

export const authExchangeSilentAuthTokenSchema = Type.Object({
    uuid: Type.String({
        title: 'Session uuid',
        minLength: 1
    }),
    token: Type.String({
        title: 'Silent token',
        minLength: 1
    })
});
