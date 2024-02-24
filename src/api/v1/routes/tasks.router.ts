import express from 'express';
import { createTask, deleteTask, getTask, updateTask } from '../controllers';
import { isAuthorized } from '../../../middlewares';

export const tasksRouter = express.Router();

tasksRouter.get('/:id', isAuthorized, getTask);
tasksRouter.post('/', isAuthorized, createTask);
tasksRouter.patch('/:id', isAuthorized, updateTask);
tasksRouter.delete('/:id', isAuthorized, deleteTask);
