import { Type } from '@sinclair/typebox';

export const stickersImportToTelegramSchema = Type.Object({
    access_token: Type.String({
        title: 'VK ID access token',
        minLength: 1
    })
});
