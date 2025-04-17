import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt, increment
} from 'firebase/database';


export const toggleLikeThread = async (userId, threadId, userData) => {
    try {
      if (!userId || !threadId || !userData?.userId || !userData?.username) {
        throw new Error('Missing required parameters: userId, threadId, or userData');
      }
  
      const threadLikesRef = ref(database, `threads/${threadId}/likes`);
  
      const likeQuery = query(threadLikesRef, orderByChild('userId'), equalTo(userId));
      const likeSnapShot = await get(likeQuery);
      var existingLikeId = null;
      if (likeSnapShot.exists()) {
        likeSnapShot.forEach((child) => {
            existingLikeId = child.key; 
            return true;
        })
      }
  
      const updates = {};
  
      if (existingLikeId) {
        updates[`threads/${threadId}/likes/${existingLikeId}`] = null;
      } else {
        const newLikeRef = push(threadLikesRef); 
        const likeData = {
            threadId,
            userId: userData.userId,
            username: userData.username,
            avatar_path: userData.avatar,
            userEmail: userData.email,
            createdAt: { '.sv': 'timestamp' },
        };
  
        updates[`threads/${threadId}/likes/${newLikeRef.key}`] = likeData;
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