import { DatabaseError, NotFoundError } from '../../../../errors';
import { getTaskById } from '../../repository';
import { TaskWithId } from '../../schemas';

export async function getOne(id: number): Promise<TaskWithId> {
  let task: TaskWithId | null;
  
  try {
    task = await getTaskById(id);
  } catch (error) {
    throw new DatabaseError('Error retrieving task');
  }

  if (!task) {
    throw new NotFoundError('Task not found');
  }
  
  return task;
}
