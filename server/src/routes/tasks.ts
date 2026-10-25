import { Router } from 'express';

import * as controller from '../controllers/tasks.js';
import { validateBody, validateParams } from '../shared/middlewares/validate.js';
import {
    projectParamsSchema,
    taskInputSchema,
    taskParamsSchema,
} from '../shared/schemes/schemes.js';

export const tasksRouter = Router({ mergeParams: true });

tasksRouter.get('/', validateParams(projectParamsSchema), controller.list);
tasksRouter.get('/:taskId', validateParams(taskParamsSchema), controller.get);
tasksRouter.post(
    '/',
    validateParams(projectParamsSchema),
    validateBody(taskInputSchema),
    controller.create
);
tasksRouter.put(
    '/:taskId',
    validateParams(taskParamsSchema),
    validateBody(taskInputSchema),
    controller.update
);
tasksRouter.delete('/:taskId', validateParams(taskParamsSchema), controller.remove);
