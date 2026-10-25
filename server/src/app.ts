import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { authRouter } from './routes/auth.js';
import { projectsRouter } from './routes/projects.js';
import { tasksRouter } from './routes/tasks.js';
import { auth } from './shared/middlewares/auth.js';
import {
    apiErrorHandler,
    databaseConstraintErrorHandler,
    errorHandler,
    foreignKeyErrorHandler,
    malformedJsonErrorHandler,
    oversizedBodyErrorHandler,
    validationErrorHandler,
} from './shared/middlewares/error-handler.js';
import { notFoundMiddleware } from './shared/middlewares/not-found.js';
import { verifyOrigin } from './shared/middlewares/origin.js';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { db } from './shared/utils/db.js';

export function createApp() {
    const app: Express = express();

    app.disable('x-powered-by');
    app.use(helmet());

    app.use(requestLogger);

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ limit: '16kb' }));
    app.use(cookieParser());

    app.get('/api/health', async (_req, res) => {
        try {
            await db.one('SELECT 1 AS ready');
            res.json({ status: 'ok' });
        } catch {
            res.status(503).json({ status: 'unavailable' });
        }
    });

    app.use('/api', verifyOrigin);
    app.use('/api/auth', authRouter);
    app.use('/api/projects', auth, projectsRouter);
    app.use('/api/project/:projectId/tasks', auth, tasksRouter);

    app.use(notFoundMiddleware);

    app.use(validationErrorHandler);
    app.use(malformedJsonErrorHandler);
    app.use(oversizedBodyErrorHandler);
    app.use(foreignKeyErrorHandler);
    app.use(databaseConstraintErrorHandler);
    app.use(apiErrorHandler);
    app.use(errorHandler);

    return app;
}
