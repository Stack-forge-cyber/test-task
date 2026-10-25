import { db } from '../shared/utils/db.js';
import type { AuthenticatedUser, User } from '../shared/utils/types.js';

export async function findUser(username: string): Promise<User | null> {
    return db.oneOrNone<User>(
        'SELECT id, username, password_hash, auth_version FROM users WHERE username=$1',
        [username]
    );
}

export async function findUserById(id: number): Promise<AuthenticatedUser | null> {
    return db.oneOrNone<AuthenticatedUser>(
        'SELECT id, username, auth_version FROM users WHERE id=$1',
        [id]
    );
}

export async function incrementAuthVersion(userId: number): Promise<null> {
    return db.none('UPDATE users SET auth_version=auth_version+1 WHERE id=$1', [userId]);
}
