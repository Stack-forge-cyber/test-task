import { db } from '../shared/utils/db.js';
import type { Project, ProjectInput } from '../shared/utils/types.js';

type ProjectRow = Omit<Project, 'budget_kopecks'> & { budget_kopecks: string };

const COLUMNS = 'id, name, budget_kopecks, start_date::text AS start_date, priority';

export async function listProjects(limit: number, offset: number) {
    const [rows, count] = await db.tx(async (tx) =>
        Promise.all([
            tx.any<ProjectRow>(`SELECT ${COLUMNS} from projects LIMIT $1 OFFSET $2`, [
                limit,
                offset,
            ]),
            tx.one('SELECT count(*)::text AS total FROM projects'),
        ])
    );
    return {
        rows: rows.map(budgetToNumber),
        total: Number(count.total),
    };
}

export async function getProject(id: number) {
    const project = await db.oneOrNone<ProjectRow>(
        `SELECT ${COLUMNS} FROM projects WHERE id = $1`,
        [id]
    );
    return project ? budgetToNumber(project) : null;
}

export async function createProject(input: ProjectInput) {
    const project = await db.one<ProjectRow>(
        `INSERT INTO projects(name, budget_kopecks, start_date, priority) VALUES($1, $2, $3, $4) RETURNING ${COLUMNS}`,
        [input.name, input.budget_kopecks, input.start_date, input.priority]
    );
    return budgetToNumber(project);
}

export async function updateProject(id: number, input: ProjectInput) {
    const project = await db.oneOrNone<ProjectRow>(
        `UPDATE projects SET name=$2, budgetToNumber=$3, start_date=$4, priority=$5 WHERE id=$1 RETURNING ${COLUMNS}`,
        [input.name, input.budget_kopecks, input.start_date, input.priority]
    );

    return project ? budgetToNumber(project) : null;
}

export async function removeProject(id: number) {
    return (await db.result(`DELETE FROM projects WHERE id=$1`, [id])).rowCount > 0;
}

function budgetToNumber(row: ProjectRow): Project {
    const budgetKopecks = Number(row.budget_kopecks);
    if (!Number.isSafeInteger(budgetKopecks)) {
        throw new Error('Бюджет проекта выходит за пределы безопасного целого числа.');
    }
    return { ...row, budget_kopecks: budgetKopecks };
}
