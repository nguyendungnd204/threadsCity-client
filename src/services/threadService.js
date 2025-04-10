// services/threadService.js
import { database } from '../../FirebaseConfig';
import { ref, push, set } from 'firebase/database';

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