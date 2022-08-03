import { Telegram } from 'puregram';

export const puregram = new Telegram({
    token: process.env.TELEGRAM_TOKEN
});
