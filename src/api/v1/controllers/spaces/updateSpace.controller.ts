import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId, partialSpaceSchema, routeParamIdSchema } from '../../schemas';

export async function updateSpace(req: Request, res: Response<{ space: SpaceWithId }>, next: NextFunction) {
  const { body } = req;
  
  try {
    const { id } = routeParamIdSchema.parse(req.params);
    const updateData = partialSpaceSchema.parse(body);
    const space = await spacesService.updateOne(id, updateData);

    res.status(200);
    res.send({ space });
  
  } catch (error) {
    next(error);
  }
}
