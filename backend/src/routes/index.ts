import { auth } from './auth';
import { stickers } from './stickers';

export const routes = [
    ...auth,
    ...stickers
];

export * from './auth';
export * from './stickers';
