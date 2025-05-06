import { createThread } from '../services/threadService';
import { createComment, createReplyComment } from '../services/commentService';
import { uploadImageToCloudinary } from '../services/uploadImage';
import { showAlert } from '../components/Alert';
import { database } from '../../FirebaseConfig';
import { 
  ref, push, set, get, query, 
  orderByChild, equalTo, update, 
  remove, onValue, off,
  limitToLast, startAt, endAt
} from 'firebase/database';

export const handlePostThread = async (user, content, mediaFiles, navigation) => {
  if (!content.trim() && mediaFiles.length === 0) {
    showAlert('warning', 'Vui lòng nhập nội dung hoặc thêm ảnh');
    return false;
  }

  try {
    const uploadResults = await Promise.all(
      mediaFiles.map((file, index) => uploadImageToCloudinary(file, index))
    );
    const validMediaFiles = uploadResults.filter(file => file !== null);

    if (mediaFiles.length > 0 && validMediaFiles.length === 0) {
      showAlert('error', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return false;
    }

    const threadData = {
      content: content.trim(),
      mediaFiles: validMediaFiles,
      fullname: user?.fullname,
      avatar_path: user?.avatar || '',
    };

    const threadId = await createThread(user.oauthId, threadData);
    if (threadId) {
      showAlert('success', 'Đã đăng bài');
      setTimeout(() => navigation.goBack(), 1500); // Delay navigation to show alert
      return true;
    }
    return false;
  } catch (error) {
    console.error('Lỗi khi đăng bài:', error);
    let message = 'Đăng bài thất bại. Vui lòng thử lại';
    if (error.message.includes('network')) {
      message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn';
    } else if (error.message.includes('permission')) {
      message = 'Không có quyền đăng bài';
    }
    showAlert('error', message);
    return false;
  }
};

export const handlePostComment = async (user, content, mediaFiles, threadId, parentCommentId, navigation) => {
  if (!content.trim() && mediaFiles.length === 0) {
    showAlert('warning', 'Vui lòng nhập nội dung hoặc thêm ảnh');
    return false;
  }

  try {
    const uploadResults = await Promise.all(
      mediaFiles.map((file, index) => uploadImageToCloudinary(file, index))
    );
    const validMediaFiles = uploadResults.filter(file => file !== null);

    if (mediaFiles.length > 0 && validMediaFiles.length === 0) {
      showAlert('error', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return false;
    }

    const commentData = {
      content: content.trim(),
      mediaFiles: validMediaFiles,
      fullname: user.fullname,
      avatar_path: user.avatar,
      authorId: user.oauthId,
      threadId,
      createdAt: new Date().toISOString(),
      parentCommentId: parentCommentId || null,
    };

    const result = await createComment(commentData);
    if (result) {
      showAlert('success', 'Đã bình luận');
      setTimeout(() => navigation.goBack(), 1500); 
      return true;
    } else {
      showAlert('error', 'Lỗi bình luận');
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi đăng bình luận:', error);
    let message = 'Đăng bình luận thất bại. Vui lòng thử lại';
    if (error.message.includes('network')) {
      message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn';
    } else if (error.message.includes('permission')) {
      message = 'Không có quyền đăng bình luận';
    }
    showAlert('error', message);
    return false;
  }
};
export const handleChangeAvatar = async (oauthId, file) => {
  try {
    if (!oauthId || !file || !file.path) {
      showAlert('error', 'Thông tin đầu vào không hợp lệ');
      return false;
    }

    const uploadResult = await uploadImageToCloudinary(file, 1);
    if (!uploadResult?.imageUrl) {
      showAlert('error', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return false;
    }

    const updates = {
      [`users/${oauthId}/avatar`]: uploadResult.imageUrl,
      [`users/${oauthId}/avatar_updated_at`]: new Date().toISOString(),
    };

    await update(ref(database), updates);
    showAlert('success', 'Cập nhật ảnh đại diện thành công');
    return true;
  } catch (error) {
    console.error('Lỗi khi cập nhật ảnh đại diện:', error);
    let errorMessage = 'Cập nhật ảnh đại diện thất bại. Vui lòng thử lại';
    if (error.message?.includes('permission')) {
      errorMessage = 'Bạn không có quyền cập nhật ảnh đại diện';
    } else if (error.message?.includes('network')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối';
    }
    showAlert('error', errorMessage);
    return false;
  }
};