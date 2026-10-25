import { Router } from 'express';

import * as controller from '../controllers/projects.js';
import { validateBody, validateParams, validateQuery } from '../shared/middlewares/validate.js';
import {
    projectInputSchema,
    projectParamsSchema,
    projectsQuerySchema,
} from '../shared/schemes/schemes.js';

export const projectsRouter = Router();

projectsRouter.get('/', validateQuery(projectsQuerySchema), controller.list);
projectsRouter.get('/:projectId', validateParams(projectParamsSchema), controller.get);
projectsRouter.post('/', validateBody(projectInputSchema), controller.create);
projectsRouter.put(
    '/:projectId',
    validateParams(projectParamsSchema),
    validateBody(projectInputSchema),
    controller.update
);
projectsRouter.delete('/:projectId', validateParams(projectParamsSchema), controller.remove);
