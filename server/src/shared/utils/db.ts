import pgPromise from 'pg-promise';

import config from '../configs/config.js';

const pgp = pgPromise();
export const db = pgp(config.db.url);

export function closeDatabase(): void {
    pgp.end();
}
