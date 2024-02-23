import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { TaskWithId } from '../../schemas';

export async function listTasks(req: Request, res: Response<{ tasks: TaskWithId[] }>, next: NextFunction) {
  const { spaceId } = req.params;

  try {
    const tasks = await tasksService.getAll(Number(spaceId));

    res.status(200);
    res.send({ tasks });
  
  } catch (error) {
    next(error);
    return;
  }
}
