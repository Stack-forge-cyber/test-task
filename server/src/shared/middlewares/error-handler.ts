import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ApiError, ErrorCode } from '../utils/api.error.js';
import { logger } from '../utils/logger.js';

function errorType(error: unknown): unknown {
    return typeof error === 'object' && error !== null && 'type' in error ? error.type : undefined;
}

function databaseCode(error: unknown): unknown {
    return typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
}

export const malformedJsonErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (errorType(error) !== 'entity.parse.failed') return next(error);
    res.status(400).json({ error: ErrorCode.InvalidJson, message: 'Некорректный JSON в запросе.' });
};

export const oversizedBodyErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (errorType(error) !== 'entity.too.large') return next(error);
    res.status(413).json({ error: ErrorCode.PayloadTooLarge, message: 'Слишком большой запрос.' });
};

export const foreignKeyErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (databaseCode(error) !== '23503' && databaseCode(error) !== '23001') return next(error);
    res.status(409).json({
        error: ErrorCode.Conflict,
        message: 'Операция нарушает связь между проектом и задачами.',
    });
};

export const databaseConstraintErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    const code = databaseCode(error);
    if (code !== '23514' && code !== '23502' && code !== '22003') return next(error);
    res.status(400).json({ error: ErrorCode.BadRequest, message: 'Некорректные данные.' });
};

export const validationErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!(error instanceof ZodError)) return next(error);
    res.status(400).json({
        error: ErrorCode.ValidationError,
        message: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        })),
    });
};

export function apiErrorHandler(error: Error, _req: Request, res: Response, next: NextFunction) {
    if (!(error instanceof ApiError)) return next(error);
    const response = {
        error: error.code,
        message: error.message,
    };

    res.status(error.statusCode).json(response);
}

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
    logger.error('Unhandled request error', {
        method: req.method,
        path: req.path,
        code: databaseCode(error),
        name: error.name,
        message: error.message,
        stack: error.stack,
    });

    res.status(500).json({
        error: ErrorCode.InternalError,
        message: 'Внутренняя ошибка сервера',
    });
}
