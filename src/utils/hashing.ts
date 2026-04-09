import * as argon2 from 'argon2';

export const getPasswordHash = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};
