import { db } from '../shared/utils/db.js';
import type { Task, TaskInput } from '../shared/utils/types.js';

const COLUMNS = 'id, project_id, title, effort_minutes, end_date::text AS end_date, priority';

export async function listTasks(projectId: number) {
    return db.any<Task>(`SELECT ${COLUMNS} FROM tasks WHERE project_id=$1 ORDER BY id`, [
        projectId,
    ]);
}

export async function getTask(projectId: number, taskId: number) {
    return db.oneOrNone<Task>(`SELECT ${COLUMNS} FROM tasks WHERE project_id=$1 AND id=$2`, [
        projectId,
        taskId,
    ]);
}

export function createTask(projectId: number, input: TaskInput) {
    return db.one<Task>(
        `INSERT INTO tasks(project_id, title, effort_minutes, end_date, priority) VALUES($1,$2,$3,$4,$5) RETURNING ${COLUMNS}`,
        [projectId, input.title, input.effort_minutes, input.end_date, input.priority]
    );
}

export function updateTask(projectId: number, taskId: number, input: TaskInput) {
    return db.oneOrNone<Task>(
        `UPDATE tasks SET project_id=$2, title=$3, effort_minutes=$4, end_date=$5, priority=$6 WHERE id=$1 RETURNING ${COLUMNS}`,
        [taskId, projectId, input.title, input.effort_minutes, input.end_date, input.priority]
    );
}

export async function removeTask(projectId: number, taskId: number) {
    return (
        (await db.result(`DELETE FROM tasks WHERE project_id=$1 AND id=$2`, [projectId, taskId]))
            .rowCount > 0
    );
}

export async function hasTasksBefore(projectId: number, date: string) {
    const row = await db.one<{ exists: boolean }>(
        'SELECT EXISTS(SELECT 1 FROM tasks WHERE project_id=$1 AND end_date < $2::date) AS exists',
        [projectId, date]
    );
    return row.exists;
}
