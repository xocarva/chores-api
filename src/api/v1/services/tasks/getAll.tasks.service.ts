import { getSpaceById, getTasksBySpaceId } from '../../repository';
import { DatabaseError, NotFoundError, UnauthorizedError } from '../../../../errors';
import { TaskWithId } from '../../schemas';

export async function getAll(userId: number, spaceId: number): Promise<TaskWithId[]> {
  try {
    const space = await getSpaceById(spaceId);

    if (!space) {
      throw new NotFoundError(`Space with id ${spaceId} does not exist`);
    }

    const validUser = space.users.some(user => user.id === userId);

    if (!validUser) {
      throw new UnauthorizedError(`User not authorized to get space ${spaceId}`);
    }

    const tasks = await getTasksBySpaceId(spaceId);
    return tasks;

  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;

    } else if (error instanceof UnauthorizedError) {
      throw error;

    } else {
      throw new DatabaseError('Error retrieving tasks');
    }
  }
}
