import { NextFunction, Request, Response } from 'express';
import { invitationsService } from '../../services';
import { SpaceWithId, acceptInvitationRequestSchema } from '../../schemas';
import { decodeToken } from '../../../../utils';

interface AcceptInvitationResponse {
  spaceId: number;
  spaces: SpaceWithId[];
}

export async function acceptInvitation(req: Request, res: Response<AcceptInvitationResponse>, next: NextFunction) {
  const { token } = req.params;
  const userId = req.user?.id;
  
  try {
    const acceptInvitationData = acceptInvitationRequestSchema.parse({ token: decodeToken(token), userId });
    const acceptedInvitationResponse = await invitationsService.acceptOne(acceptInvitationData);

    res.status(200);
    res.send(acceptedInvitationResponse);
  
  } catch (error) {
    next(error);
  }
}
