import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { SpaceWithId, User } from '../../../schemas';

type UserRow = User & RowDataPacket;

export async function getSpaceById(spaceId: number): Promise<SpaceWithId | null> {
  const [spaces] = await pool.query<RowDataPacket[]>(
    'SELECT id, title, description FROM spaces WHERE id = ?',
    [spaceId],
  );

  if (spaces.length === 0) {
    return null;
  }

  const space = spaces[0] as SpaceWithId;

  const [users] = await pool.query<UserRow[]>(
    'SELECT u.id, u.name, us.admin FROM user_spaces us ' +
    'INNER JOIN users u ON us.user_id = u.id ' +
    'WHERE us.space_id = ?',
    [space.id],
  );

  return { 
    ...space, 
    users: users.map(({ id, name, admin }) => ({
      id, 
      name,
      admin: admin ?? false,
    })),
  };
}
