//services/threadService.js
import { database } from '../../FirebaseConfig';
import { ref, push, set, get, query } from 'firebase/database';

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

export const getThread = async () => {
  try{
    const threadRef = query(ref(database, 'threads'));
    const snapshot = await get(threadRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const threads = Object.entries(data).map(([key, value]) => ({
        threadid: key, // ✅ gán key làm threadid
        ...value,
      }));
      return threads; // Trả về object user(s) có name khớp
    } else {
      return [];
    }
  } catch (err){
    console.error(err)
    return [];
  }
}
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
