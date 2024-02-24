import express from 'express';
import { createSpace, deleteSpace, getSpace, listSpaces, listSpaceTasks, updateSpace } from '../controllers';
import { isAuthorized } from '../../../middlewares';

export const spacesRouter = express.Router();

spacesRouter.get('/:id', isAuthorized, getSpace);
spacesRouter.get('/', isAuthorized, listSpaces);
spacesRouter.post('/', isAuthorized, createSpace);
spacesRouter.patch('/:id', isAuthorized, updateSpace);
spacesRouter.delete('/:id', isAuthorized, deleteSpace);
spacesRouter.get('/:spaceId/tasks', isAuthorized, listSpaceTasks);
