import type { NextFunction, Request, Response } from 'express';

import { ApiError, ErrorCode } from '../utils/api.error.js';

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction) {
    next(new ApiError(404, ErrorCode.NotFound, 'Маршрут не найден.'));
}
