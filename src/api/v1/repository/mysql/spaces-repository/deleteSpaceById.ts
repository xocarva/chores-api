import { pool } from '../mysqlConnection';
import { ResultSetHeader } from 'mysql2/promise';

export async function deleteSpaceById(id: number): Promise<Boolean> {
  const [ result ] = await pool.query<ResultSetHeader>(
    'DELETE FROM spaces WHERE id = ?',
    [id],
  );

  return result.affectedRows > 0;
}
