import { getActiveInvitationByToken, acceptInvitation } from '../../repository';
import { DatabaseError, ForbiddenError } from '../../../../errors';
import { AcceptInvitationData, InvitationWithId, SpaceWithId } from '../../schemas';

export async function acceptOne(acceptInvitationData: AcceptInvitationData): Promise<{ spaceId: number, spaces: SpaceWithId[] }> {
  const { userId, token } = acceptInvitationData;
  let invitation: InvitationWithId | null;

  try {
    invitation = await getActiveInvitationByToken(token);

  } catch (error) {
    throw new DatabaseError('Error checking if token is valid');
  }

  if (!invitation) {
    throw new ForbiddenError('Token not valid');
  }

  try {
    const { spaceId, spaces } = await acceptInvitation(invitation.id, userId);
    return { spaceId, spaces };
    
  } catch (error) {
    throw new DatabaseError('Error processing invitation');
  }


}
