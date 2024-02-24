import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { Task, taskSchema } from '../../schemas';

type TaskRequest = Request & { body: Task };

export async function createTask(req: TaskRequest, res: Response<{ id: number }>, next: NextFunction) {
  const { body } = req;

  try {
    const task = taskSchema.parse(body);
    const { id } = await tasksService.createOne(task);

    res.status(201);
    res.send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
