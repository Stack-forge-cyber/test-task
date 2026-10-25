import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

type Source = 'body' | 'params' | 'query';

function validateMiddleware(source: Source, schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = schema.parse(req[source]);
        if (source === 'body') req.body = data;
        next();
    };
}

export const validateBody = (schema: z.ZodType) => validateMiddleware('body', schema);
export const validateParams = (schema: z.ZodType) => validateMiddleware('params', schema);
export const validateQuery = (schema: z.ZodType) => validateMiddleware('query', schema);
