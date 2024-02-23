import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../mysqlConnection';
import { PartialSpace, SpaceWithId, UserWithId } from '../../../schemas';

export async function updateSpace(id: number, spaceData: PartialSpace): Promise<SpaceWithId> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (spaceData.title || spaceData.description) {
      await connection.query(
        'UPDATE spaces SET title = COALESCE(?, title), description = COALESCE(?, description) WHERE id = ?',
        [spaceData.title, spaceData.description, id],
      );
    }

    if (spaceData.users) {
      await connection.query('DELETE FROM user_spaces WHERE space_id = ?', [id]);

      for (const user of spaceData.users) {
        await connection.query(
          'INSERT INTO user_spaces (space_id, user_id, admin) VALUES (?, ?, ?)',
          [id, user.id, user.admin || false],
        );
      }
    }

    await connection.commit();

    const [ updatedSpaceRows ] = await connection.query<RowDataPacket[]>(
      'SELECT id, title, description FROM spaces WHERE id = ?',
      [id],
    );

    const [ usersRows ] = await connection.query<RowDataPacket[]>(
      `SELECT u.id, u.name, u.email, us.admin 
       FROM user_spaces us
       JOIN users u ON us.user_id = u.id
       WHERE us.space_id = ?`,
      [id],
    );

    if (updatedSpaceRows.length === 0) {
      throw new Error('Space not found');
    }

    const space: SpaceWithId = {
      id: updatedSpaceRows[0].id,
      title: updatedSpaceRows[0].title,
      description: updatedSpaceRows[0].description,
      users: usersRows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        admin: row.admin,
      })) as UserWithId[],
    };

    return space;

  } catch (error) {
    console.log(error);
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
