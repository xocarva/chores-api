import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { TaskWithId, User } from '../../../schemas';

type UserRow = User & RowDataPacket;

export async function getTaskById(id: number): Promise<TaskWithId | null> {
  const [ tasks ] = await pool.query<RowDataPacket[]>(
    'SELECT id, title, date, completed, space_id as spaceId, description FROM tasks WHERE id = ?',
    [id],
  );

  if (tasks.length === 0) {
    return null;
  }

  const task = tasks[0] as TaskWithId;

  const [ users ] = await pool.query<UserRow[]>(`
    SELECT u.id, u.name
    FROM task_users tu
    JOIN users u
    ON tu.user_id = u.id
    WHERE tu.task_id = ?`,
  [task.id],
  );

  return { 
    ...task, 
    users: users.map(user => ({
      id: user.id, 
    })),
  };
}
