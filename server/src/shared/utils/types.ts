import type { Request } from 'express';
import z from 'zod';

import {
    loginSchema,
    projectInputSchema,
    projectParamsSchema,
    projectsQuerySchema,
    taskInputSchema,
    taskParamsSchema,
} from '../schemes/schemes.js';

export interface Project {
    id: number;
    name: string;
    budget_kopecks: number;
    start_date: string;
    priority: number;
}

export interface Task {
    id: number;
    project_id: number;
    title: string;
    effort_minutes: string;
    end_date: string;
    priority: number;
}

export type ProjectParams = z.infer<typeof projectParamsSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export interface User {
    id: number;
    username: string;
    password_hash: string;
    auth_version: number;
}

export type AuthenticatedUser = Pick<User, 'id' | 'username' | 'auth_version'>;
