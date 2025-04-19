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
    
    // Cập nhật số lượng bình luận trong thread
    const threadRef = ref(database, `threads/${commentData.threadId}/comments/${newCommentRef.key}`);
    await set(threadRef, true);

    return newCommentRef.key; 
  } catch (err) {
    console.error('Error creating comment:', err);
    return false;
  }
};

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

export const getCommentById = async (commentId) => {
  try {
    const commentRef = ref(database, `comments/${commentId}`);
    const snapshot = await get(commentRef);
    if (snapshot.exists()) {
      return { id: commentId, ...snapshot.val() };
    }
    return null;
  } catch (err) {
    console.error('Lỗi khi lấy comment theo ID:', err);
    return null;
  }
};