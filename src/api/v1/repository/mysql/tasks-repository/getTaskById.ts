import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { TaskWithId, User } from '../../../schemas';

type UserRow = User & RowDataPacket;

export async function getTaskById(id: number): Promise<TaskWithId | null> {
  const [ tasks ] = await pool.query<RowDataPacket[]>(
    'SELECT id, title, date, completed, space_id as spaceId FROM tasks WHERE space_id = ?',
    [id],
  );

  if (tasks.length === 0) {
    return null;
  }

  const task = tasks[0] as TaskWithId;

  const [ users ] = await pool.query<UserRow[]>(
    'SELECT u.id FROM user_tasks us JOIN users u ON us.userId = u.id WHERE us.spaceId = ?',
    [task.id],
  );

  return { 
    ...task, 
    users: users.map(user => ({
      id: user.id, 
    })),
  };
}
