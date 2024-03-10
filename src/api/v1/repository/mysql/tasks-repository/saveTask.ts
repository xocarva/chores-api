import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { Task, TaskWithId } from '../../../schemas';

export async function saveTask(taskData: Task): Promise<TaskWithId> {
  interface TaskUser {
    id: number;
    name: string;
  }

  const { title, date, completed, spaceId, users, description } = taskData;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [ taskResult ] = await connection.query<ResultSetHeader>(
      'INSERT INTO tasks (title, date, completed, space_id, description) VALUES (?, ?, ?, ?, ?)',
      [title, date ?? null, completed ?? false, spaceId, description ?? null],
    );

    const taskId = taskResult.insertId;

    for (const user of users) {
      await connection.query(
        'INSERT INTO task_users (task_id, user_id) VALUES (?, ?)',
        [taskId, user.id],
      );
    }

    const [usersResult] = await connection.execute<RowDataPacket[]>(
      'SELECT u.id, u.name FROM users u INNER JOIN task_users tu ON tu.user_id = u.id WHERE tu.task_id = ?',
      [taskId],
    );

    const taskUsers: TaskUser[] = usersResult.map(user => ({ id: user.id, name: user.name }));

    await connection.commit();

    return { ...taskData, id: taskId, users: taskUsers };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
