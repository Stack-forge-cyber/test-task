import type { Server } from 'node:http';

import { createApp } from './app.js';
import config from './shared/configs/config.js';
import { logger } from './shared/utils/logger.js';

async function bootstrap() {
    const app = createApp();

    const server = app.listen(config.app.port, () => {
        logger.info('Server started', { port: config.app.port });
    });

    registerShutdown(server);
}

function registerShutdown(server: Server): void {
    const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
        logger.info('Graceful shutdown started', { signal });

        server.close(async (error) => {
            if (error) {
                logger.error('HTTP server shutdown failed', { message: error.message });
                process.exitCode = 1;
            }

            process.exit();
        });
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

bootstrap();
