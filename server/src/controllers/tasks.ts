import type { Request, Response } from 'express';

import * as projectModel from '../models/projects.js';
import * as taskModel from '../models/tasks.js';
import { ApiError, ErrorCode } from '../shared/utils/api.error.js';
import type { ProjectParams, TaskInput, TaskParams } from '../shared/utils/types.js';

export const get = async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params as TaskParams;

    const task = await taskModel.getTask(Number(projectId), Number(taskId));
    if (!task) throw new ApiError(404, ErrorCode.NotFound, 'Задача не найдена.');

    res.json(task);
};

export const list = async (req: Request, res: Response) => {
    const { projectId } = req.params as ProjectParams;
    const id = Number(projectId);

    const project = await projectModel.getProject(id);

    if (!project) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден.');

    res.json(await taskModel.listTasks(id));
};

export const create = async (req: Request, res: Response) => {
    const { projectId } = req.params as ProjectParams;
    const id = Number(projectId);
    const project = await projectModel.getProject(id);
    const input = req.body as TaskInput;

    if (!project) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден.');
    if (input.end_date < project.start_date)
        throw new ApiError(
            404,
            ErrorCode.NotFound,
            'Срок задачи не может быть раньше даты начала проекта.'
        );

    const task = await taskModel.createTask(id, input);
    res.status(201).location(`/api/project/${id}/tasks/${task}`).json(task);
};

export const update = async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params as TaskParams;
    const id = Number(projectId);
    const project = await projectModel.getProject(id);
    const input = req.body as TaskInput;

    if (!project) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден.');
    if (input.end_date < project.start_date)
        throw new ApiError(
            404,
            ErrorCode.NotFound,
            'Срок задачи не может быть раньше даты начала проекта.'
        );

    const task = await taskModel.updateTask(Number(projectId), Number(taskId), input);
    if (!task) throw new ApiError(404, ErrorCode.NotFound, 'Задача не найдена в этом проекте.');

    res.json(task);
};

export const remove = async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params as TaskParams;

    const isRemoved = await taskModel.removeTask(Number(projectId), Number(taskId));

    if (!isRemoved) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден.');

    res.status(204).end();
};
