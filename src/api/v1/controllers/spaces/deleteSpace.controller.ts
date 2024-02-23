import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { routeParamIdSchema } from '../../schemas';

export async function deleteSpace(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    await spacesService.deleteOne(id);

    res.status(200);
    res.send({ message: `Space with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
