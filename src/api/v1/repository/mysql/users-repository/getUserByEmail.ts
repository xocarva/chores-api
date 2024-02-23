import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { UserWithId } from '../../../schemas';

export async function getUserByEmail(email: string): Promise<UserWithId> {
  const [ rows ] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, password, email FROM users WHERE email = ?',
    [email],
  );

  const user: UserWithId = rows[0] as UserWithId;

  return user;
}
