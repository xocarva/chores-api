import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { SpaceWithId, User } from '../../../schemas';

type UserRow = User & RowDataPacket;

export async function getSpaceById(id: number): Promise<SpaceWithId | null> {
  const [spaces] = await pool.query<RowDataPacket[]>(
    'SELECT id, title, description FROM spaces WHERE id = ?',
    [id],
  );

  if (spaces.length === 0) {
    return null;
  }

  const space = spaces[0] as SpaceWithId;

  const [users] = await pool.query<UserRow[]>(
    'SELECT user_id as id, admin FROM user_spaces WHERE space_id = ?',
    [space.id],
  );

  return { 
    ...space, 
    users: users.map(user => ({
      id: user.id, 
      admin: user.admin ?? false,
    })),
  };
}
