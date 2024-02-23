import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { routeParamIdSchema } from '../../schemas';

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    await tasksService.deleteOne(id);

    res.status(200);
    res.send({ message: `Task with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
