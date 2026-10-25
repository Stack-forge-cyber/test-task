import { randomBytes } from 'node:crypto';

import argon2 from 'argon2';

import { closeDatabase, db } from './shared/utils/db.js';

const username = 'reviewer';
const password = randomBytes(24).toString('base64url');

try {
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });
    await db.none(
        `INSERT INTO users(username, password_hash) VALUES($1, $2)
     ON CONFLICT (username) DO UPDATE SET
       password_hash=EXCLUDED.password_hash,
       auth_version=users.auth_version+1`,
        [username, passwordHash]
    );
    console.log(`Логин: ${username}\nПароль (сохраните сейчас): ${password}`);
} catch (error) {
    console.error(
        'Не удалось создать учётную запись проверяющего:',
        error instanceof Error ? error.message : String(error)
    );
    process.exitCode = 1;
} finally {
    closeDatabase();
}
