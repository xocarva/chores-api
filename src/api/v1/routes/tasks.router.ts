import express from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers';

export const spacesRouter = express.Router();

spacesRouter.get('/:id', getTask);
spacesRouter.get('/:spaceId', listTasks);
spacesRouter.post('/', createTask);
spacesRouter.patch('/:id', updateTask);
spacesRouter.delete('/:id', deleteTask);
