import { DatabaseError } from '../../../../errors';
import { getAllSpaces } from '../../repository';
import { PartialSpaceWithId, SpaceWithId } from '../../schemas';

export function getAll(params: PartialSpaceWithId): Promise<SpaceWithId[]> {
  try {
    const spaces = getAllSpaces(params);
    return spaces;

  } catch (error) {
    throw new DatabaseError('Error retrieving spaces');
  }
}
