import { View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Auth/AuthContext';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import firestore from '@react-native-firebase/firestore';

const CreateScreens = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handlePostThread = async () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung hoặc thêm ảnh');
      return;
    }

    setIsUploading(true);

    try {
      // Chuyển đổi image objects thành mảng URLs
      const imageUrls = images
        .map(image => image?.uri || image?.path || '')
        .filter(url => url !== '');

      const threadData = {
        content: content.trim(),
        images: imageUrls,
        authorId: user.oauthId,
        authorName: user.fullname || 'Người dùng ẩn danh',
        authorAvatar: user.avatar || '',
        likes: [],
        comments: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection('Threads')
        .add(threadData);

      Alert.alert('Thành công', 'Đã đăng bài thành công', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
            setContent('');
            setImages([]);
          }
        }
      ]);
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      Alert.alert('Lỗi', error.message || 'Đăng bài thất bại. Vui lòng thử lại');
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
          initialImages={images}
        />
        
        <View className="flex-row mt-auto pb-[50px] px-[20px] items-center">
          <Text className="text-[16px] text-gray-500">
            Bất kỳ ai cũng có thể trả lời và trích dẫn
          </Text>
          
          <TouchableOpacity 
            className="ml-auto w-[70px] h-[40px] bg-black rounded-[20px] items-center justify-center"
            onPress={handlePostThread}
            disabled={isUploading || (!content.trim() && images.length === 0)}
            style={{
              opacity: (isUploading || (!content.trim() && images.length === 0)) ? 0.5 : 1
            }}
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