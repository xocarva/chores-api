import { pool } from '../mysqlConnection';
import { InvitationWithId } from '../../../schemas';
import { RowDataPacket } from 'mysql2';

export async function getActiveInvitationByToken(token: string): Promise<InvitationWithId | null> {
  const [invitations] = await pool.query<RowDataPacket[]>(
    'SELECT id, token, space_id as spaceId, accepted FROM invitations WHERE token = ? AND accepted = FALSE',
    [token],
  );

  if (invitations.length === 0) {
    return null;
  }

  const invitation = invitations[0] as InvitationWithId;

  return invitation;

}
