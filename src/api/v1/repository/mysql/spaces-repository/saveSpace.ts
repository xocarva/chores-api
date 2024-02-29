import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';
import { Space } from '../../../schemas';

export async function saveSpace(spaceData: Space) {
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

    const usersData = users.map(user => ({ id: Number(user.id), admin: user.admin ?? false }));

    return { ...spaceData, id: spaceId, users: usersData };

  } catch (error) {
    await connection.rollback();

    throw error;

  } finally {
    connection.release();
  }
}
