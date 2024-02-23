import { deleteSpaceById, getSpaceById } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';

export async function deleteOne(id: number): Promise<void> {
  const space = await getSpaceById(id);

  if (!space) {
    throw new NotFoundError(`Space with id ${id} not found`);
  }

  const deleted = await deleteSpaceById(id);

  if (!deleted) {
    throw new DatabaseError(`Space with id ${id} could not be deleted`);
  }
}
