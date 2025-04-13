// services/threadService.js
import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';
export const createThread = async (data) => {
  try {
    console.log('Starting createThread function with data:', data);
    
    // Lấy tham chiếu đến bảng threads
    const threadsRef = ref(database, 'threads');
    console.log('Threads reference obtained');
    
    // Tạo ID mới bằng push
    const newThreadRef = push(threadsRef);
    console.log('Generated new thread ID');
    
    // Lưu dữ liệu
    await set(newThreadRef, data);
    console.log('Thread created successfully with key:', newThreadRef.key);
    
    return newThreadRef.key;
  } catch (error) {
    console.error('Error in createThread:', error.message);
    console.error('Error stack:', error.stack);
    return null;
  }
};
export const getThreadById = async (threadId) => {
  try {
    const threadRef = ref(database, `threads/${threadId}`);
    const snapshot = await get(threadRef);
    
    if (snapshot.exists()) {
      return { 
        id: threadId,
        ...snapshot.val()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting thread by ID:', error);
    throw error;
  }
};

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