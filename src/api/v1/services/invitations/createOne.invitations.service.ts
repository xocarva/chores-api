import { saveInvitation } from '../../repository';
import { DatabaseError } from '../../../../errors';
import { InvitationWithId } from '../../schemas';

export async function createOne(spaceId: number, token: string): Promise<InvitationWithId> {
  try {
    const id = await saveInvitation(spaceId, token);
    return {
      id,
      spaceId,
      token,
      accepted: false,
    };
  
  } catch (error) {
    throw new DatabaseError('Error creating invitation');
  }
}
