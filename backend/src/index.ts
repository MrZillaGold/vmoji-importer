import os from 'os';
import dotenv from 'dotenv';
import cluster from 'cluster';
import cors from '@fastify/cors';

import { fastify } from './fastify';

import { routes } from './routes';

dotenv.config();

const port = Number(process.env.PORT) || 3001;

await fastify.register(cors, {
    origin: [/\.vk-apps\.com$/]
});

routes.forEach(fastify.register);

if (cluster.isPrimary) {
    const cpus = os.cpus().length;

    for (let index = 0; index < cpus; index++) {
        createWorker();
    }
} else {
    fastify.listen({
        port
    });

    console.log(`App listening at 0.0.0.0:${port}`);
    console.log(`Worker ${cluster?.worker?.id} launched`);
}

function createWorker() {
    const worker = cluster.fork();

    worker.on('exit', (worker, code) => {
        console.log(`Worker ${worker} finished. Exit code: ${code}`);
    });
}
