import { pool } from '../mysqlConnection';
import { RowDataPacket } from 'mysql2';
import { PartialUserWithId, TaskWithId } from '../../../schemas';

interface TaskUserRow extends RowDataPacket {
  taskId: number;
  title: string;
  date: Date | null;
  completed: boolean;
  spaceId: number;
  userId: number;
  userName: string;
}

export async function getTasksBySpaceId(spaceId: number): Promise<TaskWithId[]> {
  const query = `
    SELECT
         t.id AS taskId, t.title, t.date, t.completed, t.space_id AS spaceId,
         u.id AS userId, u.name AS userName
    FROM tasks t
    JOIN task_users tu ON t.id = tu.task_id
    JOIN users u ON tu.user_id = u.id
    WHERE t.space_id = ?
    ORDER BY t.id, u.id`;

  const [rows] = await pool.query<TaskUserRow[]>(query, [spaceId]);

  const tasks: TaskWithId[] = [];
  const tasksMap: { [key: number]: TaskWithId } = {};

  rows.forEach(row => {
    if (!tasksMap[row.taskId]) {
      tasksMap[row.taskId] = {
        id: row.taskId,
        title: row.title,
        date: row.date ?? undefined,
        completed: row.completed,
        spaceId: row.spaceId,
        users: [],
      };
      tasks.push(tasksMap[row.taskId]);
    }

    const user: PartialUserWithId = {
      id: row.userId,
      name: row.userName,
    };
    tasksMap[row.taskId].users.push(user);
  });

  return tasks;
}
