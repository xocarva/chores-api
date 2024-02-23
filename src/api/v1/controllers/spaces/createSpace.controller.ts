import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';
import { Space, spaceSchema } from '../../schemas';

type SpaceRequest = Request & { body: Space };

export async function createSpace(req: SpaceRequest, res: Response<{ id: number }>, next: NextFunction) {
  const { body } = req;

  try {
    const space = spaceSchema.parse(body);
    const { id } = await spacesService.createOne(space);

    res.status(201);
    res.send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
