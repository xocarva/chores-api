import { getTaskById, updateTask } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';
import { PartialTask, TaskWithId, partialTaskSchema } from '../../schemas';

export async function updateOne(id: number, taskData: PartialTask): Promise<TaskWithId> {
  let task: TaskWithId | null;

  try {
    task = await getTaskById(id);

  } catch (error) {
    throw new DatabaseError(`Error checking if task with id ${id} exists`);
  }

  if (!task) {
    throw new NotFoundError(`Space with id ${id} not found`);
  }

  const updatedData = partialTaskSchema.parse(taskData);

  try {
    const updated = await updateTask(id, updatedData);
    return updated;
    
  } catch (error) {
    throw new DatabaseError('Error updating task');
  }
}
