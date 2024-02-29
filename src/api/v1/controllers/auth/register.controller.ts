import { NextFunction, Request, Response } from 'express';
import { authService } from '../../services';
import { User, userSchema } from '../../schemas';

export async function register(req: Request<User>, res: Response, next: NextFunction) {
  const { body } = req;

  try {
    const user = userSchema.parse(body);
    const { token, userId }  = await authService.register(user);

    res.status(201);
    res.send({ token, userId });

  } catch (error) {
    console.log(body, error);
    next(error);
    return;
  }
}
