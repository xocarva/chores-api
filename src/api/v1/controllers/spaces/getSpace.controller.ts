import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId, routeParamIdSchema } from '../../schemas';

export async function getSpace(req: Request, res: Response<{ space: SpaceWithId }>, next: NextFunction) {
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    const space = await spacesService.getOne(id);

    if (space) {
      res.status(200);
      res.send({ space });
    }

  } catch (error) {
    next(error);
  }
}
