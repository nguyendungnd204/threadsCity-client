import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';

export const createComment = async (commentData) => {
  try {
    const commentsRef = ref(database, 'comments');
    const newCommentRef = push(commentsRef);
    const commentToCreate = {
      ...commentData,
      like: {},
      comment: {},
      repost: {},
    };
    
    await set(newCommentRef, commentToCreate);
    
    return newCommentRef.key; 
  } catch (err){
    console.error(err)
    return false
  }
}

export const getCommentsByThreadId = async (threadId) => {
    try {
      const commentRef = ref(database, 'comments');
      const queryComment = query(commentRef, orderByChild('threadId'), equalTo(threadId));
      const snapshot = await get(queryComment);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        const comments = Object.entries(data).map(([id, comment]) => ({
          id,
          ...comment,
        }));
  
        return comments;
      }
  
      return [];
    } catch (err) {
      console.error('Lỗi khi lấy comment:', err);
      return [];
    }
  };
  