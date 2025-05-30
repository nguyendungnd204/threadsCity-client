//services/threadService.js
import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';
import { getFollowings } from './followService';


// export const listenToThreads = (onThreadsUpdate) => {
//   const threadRef = query(ref(database, 'threads'));

//   const unsubscribe = onValue(threadRef, (snapshot) => {
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       const threads = Object.entries(data).map(([key, value]) => ({
//         threadid: key,
//         ...value,
//       }));

//       // sort giảm dần theo createdAt
//       const sortedThreads = threads
//         .filter(item => item !== null)
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       onThreadsUpdate(sortedThreads); // callback gửi data
//     } else {
//       onThreadsUpdate([]); // không có dữ liệu
//     }
//   }, (error) => {
//     console.error('Firebase error:', error);
//   });

//   return unsubscribe; // có thể dùng để stop listener khi unmount
// };

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
      updates[`threads/${threadId}/reposts/${existingRepostThread}`] = null;
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

export const getUserThreads = async (userId) => {
  try {
    const threadsRef = ref(database, 'threads');
    const userThreadsQuery = query(threadsRef, orderByChild('authorId'), equalTo(userId));
    const snapshot = await get(userThreadsQuery);
    
    if (snapshot.exists()) {
      console.log(snapshot.val())
      const data = snapshot.val();
      const threads = Object.entries(data).map(([key, value]) => ({
        threadid: key, //  gán key làm threadid
        ...value,
      }));
      return threads.filter(item => item !== null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
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
      if (reposts && reposts.length > 0) {
        const threads = await Promise.all(
          reposts.map((item) => getThreadById(item.parentThreadId))
        );

        const result = threads.filter(thread => thread !== null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return result;
      }
      return []; // Trả về mảng rỗng nếu không có reposts
    }
    
    return []; // Trả về mảng rỗng nếu không có dữ liệu
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
      const threads = Object.entries(data).filter(([_, value]) => value !== null).map(([key, value]) => ({
        threadid: key, //  gán key làm threadid
        ...value,
      }));
      console.log("Du lieu:", threads.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))
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

export const getThreadFollowingUser = async (userId)  => {
  try{
    if (userId) {
      const following = await getFollowings(userId);
      console.log("following", following)
      const threads = await Promise.all(
        following.map((item) => getUserThreads(item.followingId))
      );
      const result = threads.filter(item => item !== null).flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return result;
    }
  } catch (error) {
    console.error('Error getting thread following user:', error);
    throw error;
  }
}

export const deleteThreadById = async (threadId, userId) => {
  try {
    // Kiểm tra quyền sở hữu bài viết
    const thread = await getThreadById(threadId);
    if (!thread || thread.authorId !== userId) {
      throw new Error('Người dùng không có quyền xóa bài viết này');
    }

    const updates = {};

    // Xóa bài viết chính
    updates[`threads/${threadId}`] = null;

    // Xóa tham chiếu bài viết khỏi danh sách của người dùng
    updates[`users/${userId}/threads/${threadId}`] = null;

    // Xóa các repost liên quan
    const repostsRef = ref(database, `threads/${threadId}/reposts`);
    const repostsSnapshot = await get(repostsRef);

    if (repostsSnapshot.exists()) {
      repostsSnapshot.forEach((childSnapshot) => {
        const repostKey = childSnapshot.key;
        const repostData = childSnapshot.val();
        const repostUserId = repostData.userId;
        updates[`users/${repostUserId}/reposts/${repostKey}`] = null;
      });
      // updates[`threads/${threadId}/reposts`] = null;
    }

    await update(ref(database), updates);
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error);
    throw error;
  }
};