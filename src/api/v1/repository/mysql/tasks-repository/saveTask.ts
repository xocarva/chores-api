import { ResultSetHeader } from 'mysql2';
import { pool } from '../mysqlConnection';
import { Task, TaskWithId } from '../../../schemas';

export async function saveTask(taskData: Task): Promise<TaskWithId> {
  const { title, date, completed, spaceId, users, description } = taskData;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [ taskResult ] = await connection.query<ResultSetHeader>(
      'INSERT INTO tasks (title, date, completed, space_id, description) VALUES (?, ?, ?, ?, ?)',
      [title, date ?? null, completed ?? false, spaceId, description ?? null],
    );

    console.log(1);

    const taskId = taskResult.insertId;

    for (const user of users) {
      await connection.query(
        'INSERT INTO task_users (task_id, user_id) VALUES (?, ?)',
        [taskId, user.id],
      );
    }

    console.log(2);

    await connection.commit();

    return { ...taskData, id: taskId };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
