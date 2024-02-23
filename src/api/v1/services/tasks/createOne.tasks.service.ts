import { saveTask } from '../../repository';
import { DatabaseError } from '../../../../errors';
import { Task, TaskWithId } from '../../schemas';

export async function createOne(taskData: Task): Promise<TaskWithId> {
  try {
    const task = await saveTask(taskData);
    return task;
  
  } catch (error) {
    throw new DatabaseError('Error saving task');
  }
}
