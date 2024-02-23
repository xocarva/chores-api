import { pool } from '../mysqlConnection';
import { ResultSetHeader } from 'mysql2/promise';

export async function deleteTaskById(id: number): Promise<Boolean> {
  const [ result ] = await pool.query<ResultSetHeader>(
    'DELETE FROM tasks WHERE id = ?',
    [id],
  );

  return result.affectedRows > 0;
}
