import { saveSpace } from '../../repository';
import { DatabaseError } from '../../../../errors';
import { Space, SpaceWithId } from '../../schemas';

export async function createOne(spaceData: Space): Promise<SpaceWithId> {
  try {
    const space = await saveSpace(spaceData);
    return space;
  
  } catch (error) {
    throw new DatabaseError('Error saving space');
  }
}
