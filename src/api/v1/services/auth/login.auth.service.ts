import { getUserByEmail } from '../../repository';
import { generateToken, verifyPassword } from '../../../../utils';
import { DatabaseError, NotFoundError, UnauthorizedError } from '../../../../errors';
import { Credentials, UserWithId } from '../../schemas';

interface LoginResponse {
  token: string;
  userName: string;
  userId: number;
}

export async function login(credentials: Credentials): Promise<LoginResponse> {
  let user: UserWithId | null;

  try {
    user = await getUserByEmail(credentials.email);

  } catch (error) {
    throw new DatabaseError('Error getting user');
  }

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordOk = await verifyPassword(credentials.password, user.password);

  if (!isPasswordOk) {
    throw new UnauthorizedError('Invalid credentials');
  }

  return {
    token: generateToken({ user: { id: user.id } }),
    userName: user.name,
    userId: user.id,
  };
}
