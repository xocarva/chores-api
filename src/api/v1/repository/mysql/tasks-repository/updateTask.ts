import { RowDataPacket } from 'mysql2';
import { pool } from '../mysqlConnection';
import { PartialTask, TaskWithId, UserWithId } from '../../../schemas';

export async function updateTask(id: number, taskData: PartialTask): Promise<TaskWithId> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (
      taskData.title !== undefined
      || taskData.date !== undefined
      || taskData.completed !== undefined
    ) {
      const queryParams = [];
      let query = 'UPDATE tasks SET ';

      if (taskData.title !== undefined) {
        query += 'title = ?, ';
        queryParams.push(taskData.title);
      }

      if (taskData.date !== undefined) {
        query += 'date = ?, ';
        queryParams.push(taskData.date);
      }

      if (taskData.completed !== undefined) {
        query += 'completed = ?, ';
        queryParams.push(taskData.completed);
      }

      if (taskData.description !== undefined) {
        query += 'description = ?, ';
        queryParams.push(taskData.description);
      }

      query = query.slice(0, -2);
      query += ' WHERE id = ?';
      queryParams.push(id);

      await connection.query(query, queryParams);
    }


    if (taskData.users) {
      await connection.query('DELETE FROM task_users WHERE task_id = ?', [id]);

      for (const user of taskData.users) {
        await connection.query(
          'INSERT INTO task_users (task_id, user_id) VALUES (?, ?)',
          [id, user.id],
        );
      }
    }

    const [updatedTaskRows] = await connection.query<RowDataPacket[]>(
      'SELECT id, title, date, completed, space_id, description FROM tasks WHERE id = ?',
      [id],
    );

    const [usersRows] = await connection.query<RowDataPacket[]>(
      `SELECT u.id, u.name
       FROM task_users tu
       JOIN users u ON tu.user_id = u.id
       WHERE tu.task_id = ?`,
      [id],
    );

    if (updatedTaskRows.length === 0) {
      throw new Error('Task not found');
    }

    await connection.commit();

    const task: TaskWithId = {
      id: updatedTaskRows[0].id,
      title: updatedTaskRows[0].title,
      date: updatedTaskRows[0].date,
      completed: updatedTaskRows[0].completed === 1,
      spaceId: updatedTaskRows[0].spaceId,
      description: updatedTaskRows[0].description,
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
