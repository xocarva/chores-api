import { getUserByEmail, saveUser } from '../../repository';
import { encryptPassword, generateToken } from '../../../../utils';
import { ConflictError, DatabaseError } from '../../../../errors';
import { User } from '../../schemas';

interface RegisterResponse {
  token: string;
  userId: number;
}

export async function register(user: User): Promise<RegisterResponse> {
  let userExists: boolean;

  try {
    userExists = Boolean(await getUserByEmail(user.email));
  
  } catch (error) {
    throw new DatabaseError('Error checking if user exists');
  }

  if (userExists) {
    throw new ConflictError(`User with email ${user.email} already exists`);
  }

  const encryptedPassword = await encryptPassword(user.password);

  try {
    const { id } = await saveUser({ ...user, password: encryptedPassword });
    return {
      token: generateToken({ user: { id } }),
      userId: id,
    };
  
  } catch (error) {
    throw new DatabaseError('Error saving user');
  }
}
