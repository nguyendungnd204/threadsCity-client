import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserImageIcon from '../components/UserImageIcon';
import CreateIcons from '../components/CreateIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';

const CreateThreadsComponents = ({ user, isPreview=false, onContentChange, onImageChange }) => {
  const navigation = useNavigation();
  const inputRef = React.useRef(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, [content]);
  useEffect(() => {
    if (onImageChange) {
      onImageChange(images);
    }
  }, [images]);

  const selectImage = async (type) => {
    try {
      let result;
      
      if (type === 'camera') {
        result = await ImagePicker.openCamera({
          width: 800,
          height: 800,
          cropping: true,
          compressImageQuality: 0.8,
        });
      } else if (type === 'gallery') {
        result = await ImagePicker.openPicker({
          mediaType: 'any',
          multiple: true,
          maxFiles: 5,
          width: 800,
          height: 800,
          compressImageQuality: 0.8,
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

  return (
    <TouchableOpacity 
      onPress={() => {
        navigation.navigate('Create');
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
            onChangeText={setContent}
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
          <CreateIcons source={require('../assets/images/close.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>  
  );
};

export default CreateThreadsComponents;