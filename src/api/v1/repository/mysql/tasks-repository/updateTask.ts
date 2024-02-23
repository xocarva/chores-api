import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { PartialTask, TaskWithId, UserWithId } from '../../../schemas';

export async function updateTask(id: number, taskData: PartialTask): Promise<TaskWithId> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (taskData.title || taskData.date || taskData.completed !== undefined) {
      await connection.query(`
        UPDATE tasks
        SET title = COALESCE(?, title),
            date = COALESCE(?, date),
            completed = COALESCE(?, completed)
        WHERE id = ?`,
      [taskData.title, taskData.date, taskData.completed, id],
      );
    }

    if (taskData.users) {
      await connection.query('DELETE FROM task_users WHERE taskId = ?', [id]);

      for (const user of taskData.users) {
        await connection.query(
          'INSERT INTO task_users (taskId, userId, admin) VALUES (?, ?, ?)',
          [id, user.id, user.admin ?? false],
        );
      }
    }

    await connection.commit();

    const [updatedTaskRows] = await connection.query<RowDataPacket[]>(
      'SELECT id, title, date, completed, spaceId FROM tasks WHERE id = ?',
      [id],
    );

    const [usersRows] = await connection.query<RowDataPacket[]>(
      `SELECT u.id, u.name, u.email, tu.admin 
       FROM task_users tu
       JOIN users u ON tu.userId = u.id
       WHERE tu.taskId = ?`,
      [id],
    );

    if (updatedTaskRows.length === 0) {
      throw new Error('Task not found');
    }

    const task: TaskWithId = {
      id: updatedTaskRows[0].id,
      title: updatedTaskRows[0].title,
      date: updatedTaskRows[0].date,
      completed: updatedTaskRows[0].completed === 1,
      spaceId: updatedTaskRows[0].spaceId,
      users: usersRows.map((row: RowDataPacket) => ({
        id: row.id,
        name: row.name,
      })) as UserWithId[],
    };

    return task;

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}
