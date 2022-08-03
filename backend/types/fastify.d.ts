import fastify from 'fastify';

import { JWTManager, TokenType } from '../src';

declare module 'fastify' {
    export interface FastifyRequest {
        token: ReturnType<typeof JWTManager.verify>;
        getUser: () => ReturnType<typeof JWTManager.verify<TokenType.USER>>;
        getApp: () => ReturnType<typeof JWTManager.verify<TokenType.APP>>;
    }
}
