import { pool } from '../mysqlConnection';
import { RowDataPacket } from 'mysql2';
import { PartialUserWithId, SpaceWithId } from '../../../schemas';

interface SpaceUserRow extends RowDataPacket {
  spaceId: number;
  title: string;
  description: string;
  userId: number;
  userName: string;
  userAdmin: boolean;
}

export async function getSpacesByUserId(userId: number): Promise<SpaceWithId[]> {
  const query = `
    SELECT s.id AS spaceId, s.title, s.description, 
           u.id AS userId, us.admin AS userAdmin
    FROM spaces s
    JOIN user_spaces us ON s.id = us.space_id
    JOIN users u ON us.user_id = u.id
    WHERE s.id IN (
      SELECT space_id AS spaceId FROM user_spaces WHERE user_id = ?
    )
    ORDER BY s.id, u.id`;

  const [ rows ] = await pool.query<SpaceUserRow[]>(query, [userId]);

  const spaces: SpaceWithId[] = [];
  const spacesMap: { [key: number]: SpaceWithId } = {};

  rows.forEach(row => {
    if (!spacesMap[row.spaceId]) {
      spacesMap[row.spaceId] = {
        id: row.spaceId,
        title: row.title,
        description: row.description,
        users: [],
      };
      spaces.push(spacesMap[row.spaceId]);
    }

    const user: PartialUserWithId = {
      id: row.userId,
      admin: row.userAdmin,
    };
    spacesMap[row.spaceId].users.push(user);
  });

  return spaces;
}
