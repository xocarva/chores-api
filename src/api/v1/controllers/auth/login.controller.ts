import { NextFunction, Request, Response } from 'express';
import { authService } from '../../services';
import { Credentials, credentialsSchema } from '../../schemas';

export async function login(req: Request<Credentials>, res: Response, next: NextFunction) {
  const { body } = req;
  
  try {
    const credentials = credentialsSchema.parse(body);
    const { token, userName } = await authService.login(credentials);

    res.status(200);
    res.send({ token, userName });
  
  } catch (error) {
    next(error);
    return;
  }
}
