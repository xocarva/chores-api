import { deleteTaskById, getTaskById } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';

export async function deleteOne(id: number): Promise<void> {
  const task = await getTaskById(id);

  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  const deleted = await deleteTaskById(id);

  if (!deleted) {
    throw new DatabaseError(`Task with id ${id} could not be deleted`);
  }
}
