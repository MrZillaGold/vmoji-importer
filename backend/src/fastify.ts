import Fastify from 'fastify';

import { APIError, CommonErrorCode } from './error';

export const fastify = Fastify({
    logger: true
});

fastify.setErrorHandler<APIError>((error, request, reply) => {
    if (!(error instanceof APIError)) {
        error = new APIError(CommonErrorCode.ROOT_ERROR)
            .parse(error);
    }

    reply.status(error.statusCode)
        .send(
            error.toJSON()
        );
});
