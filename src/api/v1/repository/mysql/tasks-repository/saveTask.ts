import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';
import { Task, TaskWithId } from '../../../schemas';

export async function saveTask(taskData: Task): Promise<TaskWithId> {
  const { title, date, completed, spaceId, users } = taskData;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [taskResult] = await connection.query<ResultSetHeader>(
      'INSERT INTO tasks (title, date, completed, spaceId) VALUES (?, ?, ?, ?)',
      [title, date ?? null, completed, spaceId],
    );

    const taskId = taskResult.insertId;

    for (const user of users) {
      await connection.query(
        'INSERT INTO task_users (taskId, userId, admin) VALUES (?, ?, ?)',
        [taskId, user.id, user.admin ?? null],
      );
    }

    await connection.commit();

    return { ...taskData, id: taskId };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
