import { NextFunction, Request, Response } from 'express';
import { invitationsService } from '../../services';
import { InvitationBody, invitationBodySchema } from '../../schemas';
import { generateInvitationToken } from '../../../../utils';

type InvitationRequest = Request & { body: InvitationBody };

export async function createInvitation(req: InvitationRequest, res: Response<{ token: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const { spaceId } = invitationBodySchema.parse(body);
    const token = generateInvitationToken(spaceId);
    await invitationsService.createOne(spaceId, token);

    res.status(201);
    res.send({ token });
  
  } catch (error) {
    next(error);
    return;
  }
}
