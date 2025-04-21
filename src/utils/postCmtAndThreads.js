import { Alert } from 'react-native';
import { createThread } from '../services/threadService';
import { uploadImageToCloudinary } from '../components/uploadImage';
import {createComment} from '../services/commentService';

export const handlePostThread = async (user, content, mediaFiles, navigation) => {
  if (!content.trim() && mediaFiles.length === 0) {
    Alert.alert('Thông báo', 'Vui lòng nhập nội dung hoặc thêm ảnh');
    return false;
  }

  try {
    const uploadResults = await Promise.all(
      mediaFiles.map((file, index) => uploadImageToCloudinary(file, index))
    );
    const validMediaFiles = uploadResults.filter(file => file !== null);

    if (mediaFiles.length > 0 && validMediaFiles.length === 0) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return false;
    }

    const threadData = {
      content: content.trim(),
      mediaFiles: validMediaFiles,
      fullname: user?.fullname || 'Người dùng ẩn danh',
      avatar_path: user?.avatar || '',
    };

    const threadId = await createThread(user.oauthId, threadData);
    if (threadId) {
      Alert.alert('Thành công', 'Đã đăng bài thành công', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
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
    Alert.alert('Lỗi', message);
    return false;
  }
};

export const handlePostComment = async (user, content, mediaFiles, threadId, parentId, navigation) => {
  if (!content.trim() && mediaFiles.length === 0) {
    Alert.alert('Thông báo', 'Vui lòng nhập nội dung hoặc thêm ảnh');
    return false;
  }

  try {
    const uploadResults = await Promise.all(
      mediaFiles.map((file, index) => uploadImageToCloudinary(file, index))
    );
    const validMediaFiles = uploadResults.filter(file => file !== null);

    if (mediaFiles.length > 0 && validMediaFiles.length === 0) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
      return false;
    }

    const commentData = {
      content: content.trim(),
      mediaFiles: validMediaFiles,
      fullname: user?.fullname || 'Người dùng ẩn danh',
      avatar_path: user?.avatar || '',
      authorId: user.oauthId,
      threadId,
      createdAt: new Date().toISOString(),
      parentId: parentId || null,
    };

    const result = await createComment(commentData);
    if (result) {
      Alert.alert('Thành công', 'Đã đăng bình luận thành công', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Lỗi khi đăng bình luận:', error);
    let message = 'Đăng bình luận thất bại. Vui lòng thử lại';
    if (error.message.includes('network')) {
      message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn';
    } else if (error.message.includes('permission')) {
      message = 'Không có quyền đăng bình luận';
    }
    Alert.alert('Lỗi', message);
    return false;
  }
};