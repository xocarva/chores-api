import { UserWithId } from '../../../schemas';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUserByEmail(_email: string): Promise<UserWithId> {
  const user: UserWithId = {
    id: 1,
    name: 'Xoán',
    email: 'correo@exemplo.com',
    password: 'dn23rnfin3r',
  };

  return Promise.resolve(user);
}
