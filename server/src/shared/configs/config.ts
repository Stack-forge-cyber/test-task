import path from 'node:path';

import dotenv from 'dotenv';
import z from 'zod';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
});

const schema = z.object({
    NODE_ENV: z.enum(Environment).default(Environment.Production),
    APP_PORT: z.coerce.number<number>().int().min(1).max(65535),
    APP_ORIGIN: z.url().optional(),
    DATABASE_URL: z.string().url({ message: 'Строка должна быть валидным URL' }),
    JWT_SECRET: z.string().min(20),
});

const parsed = schema.parse(process.env);
if (parsed.NODE_ENV === Environment.Production && !parsed.APP_ORIGIN) {
    throw new Error('APP_ORIGIN is required in production');
}

const config = {
    app: {
        mode: parsed.NODE_ENV,
        port: parsed.APP_PORT,
        origin: parsed.APP_ORIGIN,
    },
    auth: {
        jwtSecret: parsed.JWT_SECRET,
    },
    db: {
        url: parsed.DATABASE_URL,
    },
};

export default config;
