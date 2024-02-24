import { NextFunction, Request, Response } from 'express';
import { tasksService } from '../../services';
import { TaskWithId, partialTaskSchema, routeParamIdSchema } from '../../schemas';

export async function updateTask(req: Request, res: Response<{ task: TaskWithId }>, next: NextFunction) {
  const { body } = req;
  
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    const updateData = partialTaskSchema.parse(body);
    const task = await tasksService.updateOne(id, updateData);

    res.status(200);
    res.send({ task });
  
  } catch (error) {
    next(error);
  }
}
