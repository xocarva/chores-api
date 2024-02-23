import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';
import { User, UserWithId } from '../../../schemas';

export async function saveUser(userData: User): Promise<UserWithId> {
  const { email, name, password } = userData;
  const [ result ] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
  );

  return { ...userData, id: result.insertId };
}
