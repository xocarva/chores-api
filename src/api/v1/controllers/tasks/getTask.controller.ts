import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { TaskWithId, routeParamIdSchema } from '../../schemas';

export async function getTask(req: Request, res: Response<{ task: TaskWithId }>, next: NextFunction) {
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    const task = await tasksService.getOne(Number(id));

    if (task) {
      res.status(200);
      res.send({ task });
    }

  } catch (error) {
    next(error);
  }
}
