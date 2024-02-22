import { DatabaseError, NotFoundError } from '../../../../errors';
import { getSpaceById } from '../../repository';
import { SpaceWithId } from '../../schemas';

export async function getOne(id: number): Promise<SpaceWithId> {
  let space: SpaceWithId | null;
  
  try {
    space = await getSpaceById(id);
  } catch (error) {
    throw new DatabaseError('Error retrieving space');
  }

  if (!space) {
    throw new NotFoundError('Space not found');
  }
  
  return space;
}
