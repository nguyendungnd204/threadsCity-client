import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';
import { getUserThreads } from './threadService';

export const createComment = async (commentData) => {
  try {
    if (!commentData.threadId) {
      throw new Error('threadId is required');
    }
    const commentsRef = ref(database, 'comments');
    const newCommentRef = push(commentsRef);
    const commentToCreate = {
      ...commentData,
      createdAt: { '.sv': 'timestamp' },
      like: {},
      comment: {},
      repost: {},
    };
    await set(newCommentRef, commentToCreate);
    const threadRef = ref(database, `threads/${commentData.threadId}/comments/${newCommentRef.key}`);
    await set(threadRef, true);
    // Nếu có parentId, cập nhật bình luận cha (tùy chọn)
    if (commentData.parentId) {
      const parentCommentsRef = ref(database, `comments/${commentData.parentId}/comments/${newCommentRef.key}`);
      await set(parentCommentsRef, true);
    }
    return newCommentRef.key;
  } catch (err) {
    console.error('Error creating comment:', err);
    throw err;
  }
};

export const getCommentsByThreadId = async (threadId) => {
  try {
    if (!threadId) {
      console.error('Thread ID is undefined or null');
      return [];
    }

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
    if (!commentId) {
      console.error('Comment ID is undefined or null');
      return null;
    }

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

export const getCommentByUserId = async (userId) => {
  try {
    if (!userId) {
      console.error("UserId is null")
      return []
    }
    
    const commentRef = ref(database, 'comments');
    const queryComment = query(commentRef, orderByChild('authorId'), equalTo(userId));
    const snapshot = await get(queryComment);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const comments = Object.entries(data).map(([id, comment]) => ({
        id,
        ...comment,
      }));
      return comments.filter(item => item !== null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (err) {
    console.error('Lỗi lấy comment bằng userId', err);
    return [];
  }
}
export const getAllCommentsForUser = async (userId) => {
  try {
    console.log("userId", userId)
    if (!userId) {
      console.error("UserId is null")
      return []
    }
    const thread = await getUserThreads(userId);
    console.log("thread", thread)
    const commentIds = await Promise.all(
      thread.map(async (item) => {
        const comments = ref(database, `threads/${item.threadid}/comments`);
        const snapshot = await get(comments);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const comments = Object.entries(data).map(([id, comment]) => ({
            id,
            ...comment,
          }));
          return comments;
        }
      })
    );
    console.log("commentIds", commentIds)
    const CommentList = await Promise.all(commentIds.flat().filter(item => item !== undefined).map(async (item) => {
      const result = await getCommentById(item?.id);
      return result;
    }));
    const result = CommentList.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log("CommentList: ", result);
    return result;
  } catch (err) {
    console.error('Lỗi lấy comment bằng userId', err);
    return [];
  }
}