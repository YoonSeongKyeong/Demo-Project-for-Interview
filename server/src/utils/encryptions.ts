import * as bcrypt from 'bcrypt';
import { configs } from './configs';

export const generateHash = async (plainText: string): Promise<string> => {
  try {
    return await bcrypt.hash(plainText, Number(configs.SALT_ROUND));
  } catch (error) {
    throw error;
  }
};

export const isMatch = async (plainText: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (error) {
    throw error;
  }
};
