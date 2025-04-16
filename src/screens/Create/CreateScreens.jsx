import { View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Auth/AuthContext';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import { createThread } from '../../services/threadService';

const CreateScreens = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleImagesChange = (newMediaFiles) => {
    console.log('Selected images:', newMediaFiles);

    const formattedFiles = newMediaFiles
    .map((file, index) => {
        const path = file.path;
        let type = 'image';
        if (file.mime && file.mime.startsWith('video')) {
          type = 'video';
        } else if (path && (path.endsWith('.mp4') || path.endsWith('.mov'))) {
          type = 'video';
        }

        return {
          id: index + 1, 
          path,
          type,
        };
      }
    );
    console.log('Formatted mediaFiles:', formattedFiles); 
    setMediaFiles(formattedFiles);
  };

  const uploadImageToCloudinary = async (file, index) => {
    try {
      if (!file || !file.path) {
        console.warn(`No valid path for file ID ${file.id}`);
        return null;
      }
      const path = file.path;
      const isVideo = file.type === 'video';

      let type = isVideo ? 'video/mp4' : 'image/jpeg';
      if (path.endsWith('.png')) {
        type = 'image/png';
      } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        type = 'image/jpeg';
      } else if (path.endsWith('.mov')) {
        type = 'video/quicktime';
      }

      console.log(`Uploading ${isVideo ? 'video' : 'image'} ID ${file.id}:`, path);

      const formData = new FormData();
      formData.append('file', {
        uri:path,
        type,
        name: `upload.${type.split('/')[1]}`,
      });
      formData.append('upload_preset', 'Threads-app');

      const response = await fetch(`https://api.cloudinary.com/v1_1/die2sjgsg/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Cloudinary upload failed for ID ${file.id}:`, errorData);
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (!data.secure_url) {
        console.error(`No secure_url returned for ID ${file.id}:`, data);
        return null;
      }

      console.log(`Upload successful for ID ${file.id}:`, data.secure_url);
      if (isVideo) {
        return { id: file.id, videoUrl: data.secure_url };
      }
      return { id: file.id, imageUrl: data.secure_url };
    } catch (error) {
      console.error(`Upload image error for ID ${file.id}:`, error.message);
      return null;
    }
  };

  const handlePostThread = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung hoặc thêm ảnh');
      return;
    }

    setIsUploading(true);

    try {
      const uploadResults = await Promise.all(
        mediaFiles.map((file, index) => uploadImageToCloudinary(file, index))
      );
      const validMediaFiles = uploadResults.filter(file => file !== null);

      if (mediaFiles.length > 0 && validMediaFiles.length === 0) {
        Alert.alert('Lỗi', 'Không thể tải ảnh lên Cloudinary. Vui lòng thử lại.');
        return;
      }

      const threadData = {
        content: content.trim(),
        mediaFiles: validMediaFiles,
        fullname: user?.fullname || 'Người dùng ẩn danh',
        avatar_path: user?.avatar || '',
      };

      const threadId = await createThread(user.oauthId, threadData);
      if (threadId) {
        setContent('');
        setMediaFiles([]);
        Alert.alert('Thành công', 'Đã đăng bài thành công', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      let message = 'Đăng bài thất bại. Vui lòng thử lại';
      if (error.message.includes('network')) {
        message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn';
      } else if (error.message.includes('permission')) {
        message = 'Không có quyền đăng bài';
      }
      Alert.alert('Lỗi', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-col">
        <CreateThreadsComponents 
          user={user}
          isPreview={false}
          onContentChange={handleContentChange}
          onImageChange={handleImagesChange}
          initialContent={content}
          initialImages={mediaFiles}
        />
        
        <View className="flex-row mt-auto pb-[50px] px-[20px] items-center">
          <Text className="text-[16px] text-gray-500">
            Bất kỳ ai cũng có thể trả lời và trích dẫn
          </Text>
          
          <TouchableOpacity 
            className="ml-auto w-[70px] h-[40px] bg-black rounded-[20px] items-center justify-center"
            onPress={handlePostThread}
            disabled={isUploading}
            style={{ opacity: isUploading ? 0.5 : 1 }}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-[16px] font-semibold">Đăng</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateScreens;