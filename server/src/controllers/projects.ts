import type { Request, Response } from 'express';

import * as projectModel from '../models/projects.js';
import * as taskModel from '../models/tasks.js';
import { ApiError, ErrorCode } from '../shared/utils/api.error.js';
import type { ProjectInput, ProjectParams, ProjectsQuery } from '../shared/utils/types.js';

export const get = async (req: Request, res: Response) => {
    const { projectId } = req.params as ProjectParams;

    const project = await projectModel.getProject(Number(projectId));

    if (!project) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден');

    res.json(project);
};

export const list = async (req: Request, res: Response) => {
    const { limit, offset } = req.query as ProjectsQuery;
    const pageLimit = Number(limit ?? 50);
    const pageOffset = Number(offset ?? 0);

    const projects = await projectModel.listProjects(pageLimit, pageOffset);
    res.json({
        data: projects.rows,
        meta: {
            total: projects.total,
            limit: pageLimit,
            offset: pageOffset,
        },
    });
};

export const create = async (req: Request, res: Response) => {
    const input = req.body as ProjectInput;

    if (input.start_date < today())
        throw new ApiError(404, ErrorCode.NotFound, 'Дата начала проекта не может быть в прошлом.');

    const project = await projectModel.createProject(input);

    res.status(201).location(`/api/projects/${project.id}`).json(project);
};

export const update = async (req: Request, res: Response) => {
    const { projectId } = req.params as ProjectParams;
    const id = Number(projectId);
    const input = req.body as ProjectInput;
    const current = await projectModel.getProject(Number(projectId));

    if (!current) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден');

    if (input.start_date !== current.start_date && input.start_date < today()) {
        throw new ApiError(404, ErrorCode.NotFound, 'Дата начала проекта не может быть в прошлом.');
    }
    if (await taskModel.hasTasksBefore(id, input.start_date)) {
        throw new ApiError(
            409,
            ErrorCode.Conflict,
            'Дата начала проекта не может быть позже срока его задач.'
        );
    }

    const project = await projectModel.updateProject(Number(projectId), input);

    if (!project) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден');

    res.json(project);
};

export const remove = async (req: Request, res: Response) => {
    const { projectId } = req.params as ProjectParams;

    const isRemoved = await projectModel.removeProject(Number(projectId));

    if (!isRemoved) throw new ApiError(404, ErrorCode.NotFound, 'Проект не найден');

    res.status(204).end();
};

const today = () => new Date().toISOString().slice(0, 10);
