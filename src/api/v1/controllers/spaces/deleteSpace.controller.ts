import { NextFunction, Request, Response } from 'express';
import { spacesService } from '../../services';

export async function deleteSpace(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    await spacesService.deleteOne(Number(id));

    res.status(200);
    res.send({ message: `Space with id ${id} has been deleted` });

  } catch (error) {
    next(error);
    return;
  }
}
