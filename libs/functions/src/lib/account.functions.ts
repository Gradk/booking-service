import { genSaltSync, hash } from 'bcryptjs';

export async function setPassword(password: string) {
  const salt = genSaltSync(10);
  return await hash(password, salt);
}
