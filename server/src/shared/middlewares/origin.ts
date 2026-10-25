import type { RequestHandler } from 'express';

import config from '../configs/config.js';
import { ApiError, ErrorCode } from '../utils/api.error.js';

export const verifyOrigin: RequestHandler = (req, _res, next) => {
    if (
        config.app.mode !== 'production' ||
        !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
    ) {
        return next();
    }

    if (req.get('Origin') !== config.app.origin) {
        throw new ApiError(403, ErrorCode.Forbidden, 'Недопустимый источник запроса.');
    }

    next();
};
