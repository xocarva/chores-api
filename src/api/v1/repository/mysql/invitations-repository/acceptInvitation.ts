import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../mysqlConnection';
import { InvitationWithId } from '../../../schemas';
import { getSpaceById, getSpacesByUserId, updateSpace } from '../spaces-repository';

export async function acceptInvitation(invitationId: number, userId: number) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await pool.query(
      'UPDATE invitations SET accepted = true WHERE id = ?',
      [invitationId],
    );

    const [invitations] = await pool.query<RowDataPacket[]>(
      'SELECT space_id as spaceId FROM invitations WHERE id = ?',
      [invitationId],
    );

    const { spaceId } = (invitations[0] as InvitationWithId);

    const space = await getSpaceById(spaceId);

    if (!space) throw new Error;

    const userExists = space.users.some(user => user.id === userId);

    let updatedUsers = space.users.map(user => ({
      id: user.id,
      admin: user.id === userId ? true : user.admin,
    }));

    if (!userExists) {
      updatedUsers = [...updatedUsers, { id: userId, admin: true }];
    }

    await updateSpace(spaceId, { users: updatedUsers });

    const spaces = await getSpacesByUserId(userId);

    await connection.commit();

    return { spaceId, spaces };
  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
