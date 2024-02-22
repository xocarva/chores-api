import { getSpaceById, updateSpace } from '../../repository';
import { DatabaseError, NotFoundError } from '../../../../errors';
import { PartialSpace, SpaceWithId, partialSpaceSchema } from '../../schemas';

export async function updateOne(id: number, spaceData: PartialSpace): Promise<SpaceWithId> {
  let space: SpaceWithId | null;

  try {
    space = await getSpaceById(id);

  } catch (error) {
    throw new DatabaseError(`Error checking if space with id ${id} exists`);
  }

  if (!space) {
    throw new NotFoundError(`Space with id ${id} not found`);
  }

  const updatedData = partialSpaceSchema.parse(spaceData);

  try {
    const updated = await updateSpace(id, updatedData);
    return updated;
    
  } catch (error) {
    throw new DatabaseError('Error updating space');
  }
}
