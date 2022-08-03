import axios from 'axios';
import { Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

import { VK_API_URL, VK_API_VERSION } from '../../constants';
import { authExchangeSilentAuthTokenSchema } from '../../schemas';

export const exchangeSilentAuthToken: FastifyPluginCallback = (fastify, options, done) => {
    fastify.post<{
        Body: Static<typeof authExchangeSilentAuthTokenSchema>
    }>('/auth.exchangeSilentAuthToken', {
        schema: {
            body: authExchangeSilentAuthTokenSchema
        }
    }, async (request) => {
        const { body } = request;

        return await axios.get(
            new URL('/method/auth.exchangeSilentAuthToken', VK_API_URL)
                .toString(),
            {
                params: {
                    ...body,
                    v: VK_API_VERSION,
                    access_token: process.env.SERVICE_TOKEN!
                }
            }
        )
            .then(({ data: { response } }) => response);
    });

    done();
};
