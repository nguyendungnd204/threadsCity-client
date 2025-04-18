//services/threadService.js
import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';

export const createThread = async (userId, threadData) => {
  try {
    const threadsRef = ref(database, 'threads');
    
    const newThreadRef = push(threadsRef);
    
    const threadToCreate = {
      ...threadData,
      authorId: userId,
      likes: {},
      comments: {},
      createdAt: { '.sv': 'timestamp' },
    };
    
    await set(newThreadRef, threadToCreate);
    
    const userThreadsRef = ref(database, `users/${userId}/threads/${newThreadRef.key}`);
    await set(userThreadsRef, true);
    
    return newThreadRef.key; 
  } catch (error) {
    console.error('Error creating thread:', error);
    return null;
  }
};
// export const getThreadById = async (threadId) => {
//   try {
//     const threadRef = ref(database, `threads/${threadId}`);
//     const snapshot = await get(threadRef);
    
//     if (snapshot.exists()) {
//       return { 
//         id: threadId,
//         ...snapshot.val()
//       };
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Error getting thread by ID:', error);
//     throw error;
//   }
// };

export const getUserThreads = async (userId) => {
  try {
    const threadsRef = ref(database, 'threads');
    const userThreadsQuery = query(threadsRef, orderByChild('userid'), equalTo(userId));
    const snapshot = await get(userThreadsQuery);
    
    const threads = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const threadData = childSnapshot.val();
        if (!threadData.isReply && !threadData.isRepost) {
          threads.push({
            id: childSnapshot.key,
            ...threadData,
          });
        }
      });
    }
    
    return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting user threads:', error);
    throw error;
  }
};

export const getUserReplies = async (userId) => {
 
};

export const getUserReposts = async (userId) => {
  
};

export const getThread = async () => {
  try {
    const threadRef = query(ref(database, 'threads'));
    const snapshot = await get(threadRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const threads = Object.entries(data).map(([key, value]) => ({
        threadid: key, //  gán key làm threadid
        ...value,
      }));
      return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo createdAt giảm dần
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};
export const getThreadById = async (id) => {
  try {
    const threadRef = ref(database, `threads/${id}`);
    const snapshot = await get(threadRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        threadid: id, // Gắn ID vào object trả về
        ...data,
      };
    } else {
      return null; // Không tìm thấy
    }
  } catch (err) {
    console.error('Error in getThreadById:', err);
    return null;
  }
};
