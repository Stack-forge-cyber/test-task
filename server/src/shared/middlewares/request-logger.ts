import type { NextFunction, Request, Response } from 'express';

import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    res.once('finish', () => {
        const { statusCode } = res;
        if (statusCode >= 500) return;

        const meta = {
            method: req.method,
            path: req.originalUrl,
            status: statusCode,
            durationMs: Date.now() - startedAt,
        };

        if (statusCode >= 400) logger.warn('HTTP request rejected', meta);
        else logger.info('HTTP request completed', meta);
    });

    next();
};
