import { getTasksBySpaceId } from '../../repository';
import { DatabaseError } from '../../../../errors';
import { TaskWithId } from '../../schemas';

export function getAll(id: number): Promise<TaskWithId[]> {
  try {
    const tasks = getTasksBySpaceId(id);
    return tasks;

  } catch (error) {
    throw new DatabaseError('Error retrieving tasks');
  }
}
