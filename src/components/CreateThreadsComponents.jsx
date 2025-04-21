import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import UserImageIcon from '../components/UserImageIcon';
import CreateIcons from '../components/CreateIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { getThreadById } from '../services/threadService';
import { ActivityIndicator } from 'react-native-paper';
import useFetch from '../services/useFetch';
import { uploadImageToCloudinary } from './uploadImage';
import { handlePostThread, handlePostComment } from '../utils/postCmtAndThreads';

const CreateThreadsComponents = ({ user, isPreview=false, isReply=false, ThreadId=null, parentId=null }) => {
  const navigation = useNavigation();
  const inputRef = React.useRef(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const {data: thread} = useFetch(() => getThreadById(ThreadId), true);

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
    const formattedFiles = newMediaFiles.map((file, index) => {
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
    });
    console.log('Formatted mediaFiles:', formattedFiles);
    setMediaFiles(formattedFiles);
  };

  const onPost = async () => {
    setIsUploading(true);
    try {
      let success;
      if (isReply) {
        success = await handlePostComment(user, content, mediaFiles, ThreadId, parentId, navigation);
      } else {
        success = await handlePostThread(user, content, mediaFiles, navigation);
      }
      if (success) {
        setContent('');
        setMediaFiles([]);
        setImages([]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
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
              placeholder={isReply ? `Trả lời ${thread?.fullname}...` : 'Có gì mới...'}
              placeholderTextColor='gray'
              multiline={true}
              autoFocus={!isPreview}
              className='text-[16px] text-gray-500'
              onChangeText={handleContentChange}
              value={content}
              ref={inputRef}
              style={{ textAlignVertical: 'top', minHeight: 50 }}
            />
            
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
          {isReply && (
              <TouchableOpacity
                className='absolute right-0 top-[20px] mt-5 mr-2'
                onPress={onPost}
                disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
              >
                <CreateIcons
                  source={(isUploading || content.trim() || mediaFiles.length > 0) 
                    ? require('../assets/images/sent.png') 
                    : require('../assets/images/send-arrow.png')}
                  className=''
                  resizeMode='contain'
                />
              </TouchableOpacity>
            )}
        </View>
      </TouchableOpacity>  
      {!isPreview && !isReply && (
        <View style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            zIndex: 1000,
          }}
          className="flex-row px-3 py-3 items-center"
        >
          <Text className="text-[14px] text-gray-500 flex-1">
            {isReply ? 'Bất kỳ ai cũng có thể trả lời' : 'Bất kỳ ai cũng có thể trả lời và trích dẫn'}
          </Text>

          <TouchableOpacity
            className={`ml-2 w-[${isReply ? '80' : '70'}px] h-[40px] bg-black rounded-full flex-row items-center justify-center`}
            disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
            style={{ opacity: isUploading || (!content.trim() && mediaFiles.length === 0) ? 0.5 : 1 }}
            onPress={onPost}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white text-[16px] font-semibold">Đăng</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

CreateThreadsComponents.propTypes = {
  isPreview: PropTypes.bool,
  isReply: PropTypes.bool,
  ThreadId: PropTypes.string,
  parentId: PropTypes.string,
  user: PropTypes.object,
};

export default CreateThreadsComponents;