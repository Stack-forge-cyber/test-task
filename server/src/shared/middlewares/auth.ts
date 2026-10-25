import type { NextFunction, Response } from 'express';

import * as authModel from '../../models/auth.js';
import config from '../configs/config.js';
import { ApiError, ErrorCode } from '../utils/api.error.js';
import { verifyToken } from '../utils/token.js';
import type { AuthenticatedRequest } from '../utils/types.js';

export const COOKIE_NAME =
    config.app.mode === 'production' ? '__Host-workbase' : 'workbase_session';

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
        throw new ApiError(401, ErrorCode.Unauthorized, "'Вы не авторизованы");
    }

    const claims = verifyToken(token);

    if (!claims) throw new ApiError(401, ErrorCode.InvalidToken, "'Вы не авторизованы");

    const user = await authModel.findUserById(claims.userId);

    if (!user || user.auth_version !== claims.version)
        throw new ApiError(401, ErrorCode.InvalidToken, "'Вы не авторизованы");

    req.user = user;
    next();
};
