import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt, increment
} from 'firebase/database';

export const toggleLikeThread = async (userId, threadId, userData) => {
  try {
    if (!userId || !threadId || !userData?.username || !userData?.email) {
      throw new Error('Missing required parameters: userId, threadId, username, or email');
    }

    const threadLikesRef = ref(database, `threads/${threadId}/likes`);
    
    const likeQuery = query(threadLikesRef, orderByChild('userId'), equalTo(userId));
    const likeSnapshot = await get(likeQuery);

    let existingLikeId = null;
    likeSnapshot.forEach((child) => {
      existingLikeId = child.key;
      return true; 
    });

    const updates = {};
    let newLikeKey = null;

    if (existingLikeId) {
      updates[`threads/${threadId}/likes/${existingLikeId}`] = null;
      updates[`users/${userId}/likes/${existingLikeId}`] = null;
    } else {
      const newLikeRef = push(threadLikesRef);
      newLikeKey = newLikeRef.key;
      const likeData = {
        threadId,
        userId,
        username: userData.username,
        avatar_path: userData.avatar || null, 
        userEmail: userData.email,
        createdAt: { '.sv': 'timestamp' },
      };
      const userLikeData = {
        threadId, 
        authorName: userData.authorName,
        createdAt: { '.sv': 'timestamp' },
      }
      updates[`threads/${threadId}/likes/${newLikeKey}`] = likeData;
      updates[`users/${userId}/likes/${newLikeKey}`] = userLikeData;
    }
    await update(ref(database), updates);

    return {
      success: true,
      liked: !existingLikeId, 
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};