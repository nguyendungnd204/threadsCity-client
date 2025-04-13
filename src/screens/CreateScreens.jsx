import { View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Auth/AuthContext';
import CreateThreadsComponents from '../components/CreateThreadsComponents';
import { database } from '../../FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CheckAuth from '../components/CheckAuth';

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
      const imageUrls = [];

      // 2. Tạo thread trong Firestore
      const threadData = {
        content: content.trim(),
        images: imageUrls,
        authorId: user.uid,
        authorName: user.displayName || 'Người dùng ẩn danh',
        authorAvatar: user.photoURL || '',
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(database, 'threads'), threadData);

      // 3. Thông báo thành công và quay về màn hình trước
      Alert.alert('Thành công', 'Đã đăng bài thành công', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      Alert.alert('Lỗi', 'Đăng bài thất bại. Vui lòng thử lại');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CheckAuth requireAuth={true}>
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-col">
        <CreateThreadsComponents 
          user={user}
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
    </CheckAuth>
  );
};

export default CreateScreens;