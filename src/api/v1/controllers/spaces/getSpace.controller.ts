import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId } from '../../schemas';

export async function getSpace(req: Request, res: Response<{ space: SpaceWithId }>, next: NextFunction) {
  const { id } = req.params;

  try {
    const space = await spacesService.getOne(Number(id));

    if (space) {
      res.status(200);
      res.send({ space });
    }

  } catch (error) {
    next(error);
  }
}
