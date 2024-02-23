import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { SpaceWithId } from '../../schemas';

export async function listSpaces(req: Request, res: Response<{ spaces: SpaceWithId[] }>, next: NextFunction) {
  const userId = req.user?.id;

  try {
    const spaces = await spacesService.getAll(Number(userId));

    res.status(200);
    res.send({ spaces });
  
  } catch (error) {
    next(error);
    return;
  }
}
