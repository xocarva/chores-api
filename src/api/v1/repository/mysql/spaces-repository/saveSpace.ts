import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';
import { Space, SpaceWithId } from '../../../schemas';

export async function saveSpace(spaceData: Space): Promise<SpaceWithId> {
  const { title, description, users } = spaceData;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [ spaceResult ] = await connection.query<ResultSetHeader>(
      'INSERT INTO spaces (title, description) VALUES (?, ?)',
      [title, description],
    );

    const spaceId = spaceResult.insertId;

    for (const user of users) {
      await connection.query(
        'INSERT INTO user_spaces (space_id, user_id, admin) VALUES (?, ?, ?)',
        [spaceId, user.id, user.admin ?? null],
      );
    }

    await connection.commit();

    return { ...spaceData, id: spaceId };

  } catch (error) {
    await connection.rollback();

    throw error;

  } finally {
    connection.release();
  }
}
