import jwt from 'jsonwebtoken';

import config from '../configs/config.js';

import type { User } from './types.js';

export function createToken(user: Pick<User, 'id' | 'auth_version'>): string {
    return jwt.sign({ version: user.auth_version }, config.auth.jwtSecret, {
        expiresIn: '24h',
        subject: String(user.id),
    });
}

export function verifyToken(token: string): { userId: number; version: number } | null {
    let payload: string | jwt.JwtPayload;

    try {
        payload = jwt.verify(token, config.auth.jwtSecret);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError)
            return null;
        throw error;
    }

    if (typeof payload === 'string') return null;

    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0 || !Number.isInteger(payload.version)) {
        return null;
    }
    return { userId: Number(payload.sub), version: payload.version };
}
