import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId, partialSpaceWithIdSchema } from '../../schemas';

export async function listSpaces(req: Request, res: Response<{ spaces: SpaceWithId[] }>, next: NextFunction) {
  try {
    const params = partialSpaceWithIdSchema.parse(req.query);
    const spaces = await spacesService.getAll(params);

    res.status(200);
    res.send({ spaces });
  
  } catch (error) {
    next(error);
    return;
  }
}
