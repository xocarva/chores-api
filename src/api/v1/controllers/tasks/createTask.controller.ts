import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { Task, taskSchema } from '../../schemas';

type TaskRequest = Request & { body: Task };

export async function createTask(req: TaskRequest, res: Response<{ task: Task }>, next: NextFunction) {
  const { body } = req;

  try {
    const taskData = taskSchema.parse(body);
    const task = await tasksService.createOne(taskData);

    res.status(201);
    res.send({ task });
  
  } catch (error) {
    next(error);
    return;
  }
}
