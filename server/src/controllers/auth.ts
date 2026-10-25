import argon2 from 'argon2';
import type { Request, Response } from 'express';

import * as authModel from '../models/auth.js';
import config from '../shared/configs/config.js';
import { COOKIE_NAME } from '../shared/middlewares/auth.js';
import { ApiError, ErrorCode } from '../shared/utils/api.error.js';
import { createToken } from '../shared/utils/token.js';
import type { AuthenticatedRequest, LoginInput } from '../shared/utils/types.js';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginInput;

    const user = await authModel.findUser(username);

    if (!user || !(await argon2.verify(user.password_hash, password))) {
        throw new ApiError(401, ErrorCode.Unauthorized, 'Неверный логин или пароль.');
    }

    setAuthCookie(res, createToken(user));

    res.set('Cache-Control', 'no-store').json({ username: user.username });
};

export const me = (req: AuthenticatedRequest, res: Response) => {
    res.set('Cache-Control', 'no-store').json({ username: req.user!.username });
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
    await authModel.incrementAuthVersion(req.user!.id);

    clearAuthCookie(res);

    res.status(204).end();
};

function setAuthCookie(res: Response, token: string): void {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: config.app.origin?.startsWith('https://') ?? false,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    });
}

function clearAuthCookie(res: Response): void {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: config.app.origin?.startsWith('https://') ?? false,
        sameSite: 'strict',
        path: '/',
    });
}
