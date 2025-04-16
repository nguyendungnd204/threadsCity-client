import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserImageIcon from '../components/UserImageIcon';
import CreateIcons from '../components/CreateIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { createThread } from '../services/threadService';
import { ActivityIndicator } from 'react-native-paper';

const CreateThreadsComponents = ({ user, isPreview=false }) => {

  const navigation = useNavigation();
  const inputRef = React.useRef(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
 
  useEffect(() => {
  
    handleContentChange(content);
    handleImagesChange(images);
  
  }, [content, images]);
  
  const selectImage = async (type) => {
    try {
      let result;
      
      if (type === 'camera') {
        result = await ImagePicker.openCamera({
          width: 800,
          height: 800,
          cropping: true,
          compressImageQuality: 0.5,
        });
      } else if (type === 'gallery') {
        result = await ImagePicker.openPicker({
          mediaType: 'any',
          multiple: true,
          maxFiles: 5,
          width: 800,
          height: 800,
          compressImageQuality: 0.5,
        });
      }

      if (result) {
        const selectedImages = Array.isArray(result) ? result : [result];
        setImages(prev => [...prev, ...selectedImages]);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
      }
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    inputRef.current?.clear();
    setContent('');
    setImages([]);
  };

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
          setImages([]);
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
    <TouchableOpacity 
      onPress={() => {
        isPreview && navigation.navigate('Create');
      }}
      style={
        isPreview && {
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 140,
          pointerEvents: 'box-only',
        }}
    >
      <View className='flex-row mt-5 border-b-2 border-gray-300 pb-2 px-3'>
        <UserImageIcon 
          source={user?.avatar ? { uri: user.avatar } : require('../assets/images/threads-logo-black.png')} 
          className='self-start'
        />
        
        <View className='flex-1 ml-3'>
          <Text className='text-[20px] font-bold'>
            {user?.fullname || 'Người dùng ẩn danh'}
          </Text>
          
          <TextInput
            placeholder='Có gì mới...'
            placeholderTextColor='gray'
            multiline={true}
            autoFocus={!isPreview}
            className='text-[16px] text-gray-500'
            onChangeText={handleContentChange}
            value={content}
            ref={inputRef}
            style={{ textAlignVertical: 'top', minHeight: 50 }}
          />

          {/* Hiển thị hình ảnh đã chọn */}
          <View style={{ display: images.length > 0 ? 'flex' : 'none' }} className='flex-row flex-wrap mb-2'>
              {images.map((image, index) => (
                <View key={`${image.path}-${index}`} className='relative mr-2 mb-2'>
                  <Image
                    source={{ uri: image.path }}
                    className='w-20 h-20 rounded-lg'
                  />
                  <TouchableOpacity 
                    onPress={() => removeImage(index)}
                    className='absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center'
                  >
                    <Text className='text-white text-xs'>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          <View className='flex-row justify-between items-center mt-2'>
            <View className='flex-row'>
              <TouchableOpacity 
                onPress={() => selectImage('gallery')} 
                className='mr-4'
              >
                <CreateIcons source={require('../assets/images/image-gallery.png')}/>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => selectImage('camera')} 
                className='mr-4'
              >
                <CreateIcons source={require('../assets/images/camera.png')}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={clearAll} 
          className='ml-2 self-start'
          disabled={isUploading}
        >
          {!isPreview && <CreateIcons source={require('../assets/images/close.png')}/>}
        </TouchableOpacity>
      </View>
      {!isPreview && (
          <View className="flex-row mt-2 px-3 py-3 items-center bg-white">
            <Text className="text-[14px] text-gray-500">
              Bất kỳ ai cũng có thể trả lời và trích dẫn
            </Text>

            <TouchableOpacity
              className="ml-auto w-[70px] h-[40px] bg-black rounded-full items-center justify-center"
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
        )}

    </TouchableOpacity>  
  );
};

CreateThreadsComponents.propTypes = {
  isPreview: PropTypes.bool,
}
export default CreateThreadsComponents;