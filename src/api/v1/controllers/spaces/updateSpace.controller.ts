import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId, partialSpaceSchema } from '../../schemas';

export async function updateSpace(req: Request, res: Response<{ space: SpaceWithId }>, next: NextFunction) {
  const { id } = req.params;
  const { body } = req;

  try {
    const updateData = partialSpaceSchema.parse(body);
    const space = await spacesService.updateOne(Number(id), updateData);

    res.status(200);
    res.send({ space });
  
  } catch (error) {
    next(error);
  }
}
