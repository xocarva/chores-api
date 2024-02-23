import { getSpacesByUserId } from '../../repository';
import { DatabaseError, UnauthorizedError } from '../../../../errors';
import { SpaceWithId } from '../../schemas';

export function getAll(id: number): Promise<SpaceWithId[]> {

  if (!id) {
    throw new UnauthorizedError('An error ocurred when accesing user id');
  }
  try {
    const spaces = getSpacesByUserId(id);
    return spaces;

  } catch (error) {
    throw new DatabaseError('Error retrieving spaces');
  }
}
