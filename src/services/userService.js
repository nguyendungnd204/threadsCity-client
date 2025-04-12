import { database } from '../../FirebaseConfig';
import { ref, set, get, update, push } from 'firebase/database';

export const createUser = async (userId, userData) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        ...userData,
        followers: {},
        following: {},
        createdAt: { '.sv': 'timestamp' },
        updatedAt: { '.sv': 'timestamp' }
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
