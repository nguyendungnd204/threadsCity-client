import { database } from '../../FirebaseConfig';
import { ref, set, get, update, push, query, orderByChild, equalTo } from 'firebase/database';

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

export const getUserById = async (userId) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  }
  catch (error) {
    console.error(error);
    return null;
  }
}


export const getUserByName = async ( name ) => {
  try{
    const userQuery = query(ref(database, 'users'));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const filtered = Object.entries(users).filter(([id, users]) =>
        users.fullname?.toLowerCase().includes(name.toLowerCase())
      ); // Trả về object user(s) có name khớp
      return filtered.map(([id, user]) => ({ id, ...user }));
    } else {
      return [];
    }
  } catch (error){
    console.error(error)
    return [];
  }
} 