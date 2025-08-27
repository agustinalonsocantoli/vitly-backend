import { nanoid } from 'nanoid';

export const generateHash = async (length = 32) => {
    return nanoid(length);
}; 