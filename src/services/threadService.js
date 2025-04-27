//services/threadService.js
import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';
export const toggleRepostThread = async (threadId, userId) => {
  try {
    const threadRef = ref(database, `threads/${threadId}/reposts`);
    const repostQuery = query(threadRef, orderByChild('userId'), equalTo(userId))
    const repostSnapshot = await get(repostQuery)

    let existingRepostThread = null;

    repostSnapshot.forEach((child) => {
      existingRepostThread = child.key;
      return true;
    })

    const updates = {}
    let newRepostKey = null;

    if(existingRepostThread) {
      updates[`threads/${threadId}/reposts/${existingRepostThread}`] = null
      updates[`users/${userId}/reposts/${existingRepostThread}`] = null;
    } else {
      const newRepostThreads = push(threadRef);
      newRepostKey = newRepostThreads.key;
      const dataRepostThreads = {
        userId : userId,
        parentThreadId: threadId,
        createdAt: { '.sv': 'timestamp' },
      }
      const userRepostData = {
        userId : userId,
        parentThreadId: threadId,
        createdAt: { '.sv': 'timestamp' },
      }
      updates[`threads/${threadId}/reposts/${newRepostKey}`] = dataRepostThreads;
      updates[`users/${userId}/reposts/${newRepostKey}`] = userRepostData;
    }
    await update(ref(database), updates);
    return {
      success: true,
      reposted: !existingRepostThread, 
    };
  } catch (error) {
    console.error('Error getting thread reposts:', error);
    throw error;
  }
};


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
    const userThreadsQuery = query(threadsRef, orderByChild('authorId'), equalTo(userId));
    const snapshot = await get(userThreadsQuery);
    
    // const threads = [];
    if (snapshot.exists()) {
      console.log(snapshot.val())
      // snapshot.forEach((childSnapshot) => {
      //   const threadData = childSnapshot.val();
      //   if (!threadData.isReply && !threadData.isRepost) {
      //     threads.push({
      //       threadid: childSnapshot.key,
      //       ...threadData,
      //     });
      //   }
      // });
      const data = snapshot.val();
      const threads = Object.entries(data).map(([key, value]) => ({
        threadid: key, //  gán key làm threadid
        ...value,
      }));
      return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting user threads:', error);
    throw error;
  }
};

export const getRepostThread = async (userId) => {
  try {
    const repostRef = ref(database, `users/${userId}/reposts`);
    const snapshot = await get(repostRef);
    
    if (snapshot.exists()) {
      const reposts = [];
      snapshot.forEach((childSnapshot) => {
        reposts.push({
          repostId: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      return reposts;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting thread reposts:', error);
    throw error;
  }
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



