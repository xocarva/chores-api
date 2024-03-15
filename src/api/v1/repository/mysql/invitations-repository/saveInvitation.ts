import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';

export async function saveInvitation(spaceId: number, token: string): Promise<number> {
  const [ invitationResult ] = await pool.query<ResultSetHeader>(
    'INSERT INTO invitations (space_id, token) VALUES (?, ?)',
    [spaceId, token],
  );

  const invitationId = invitationResult.insertId;

  return invitationId;
}
