import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { handleChangeAvatar } from '../../components/postCmtAndThreads';
import { updateUserBio } from '../../services/userService';
import { showAlert } from '../../components/Alert';

const DEFAULT_AVATAR = 'https://example.com/default-avatar.png'; // Thay bằng URL ảnh mặc định

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = route.params || {};
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [avatar, setAvatar] = useState(userProfile?.avatar || DEFAULT_AVATAR); // Thay images bằng avatar
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const success = await updateUserBio(userProfile.userId, bio);
      if (success) {
        showAlert('success', 'Cập nhật tiểu sử thành công!');
        navigation.goBack();
      } else {
        showAlert('error', 'Cập nhật tiểu sử thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi cập nhật tiểu sử:', error);
      showAlert('error', 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectImage = async () => {
    try {
      setIsLoading(true);
      if (!userProfile?.oauthId) {
        showAlert('error', 'Không tìm thấy thông tin người dùng.');
        return;
      }

      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        width: 800,
        height: 800,
        compressImageQuality: 0.7,
      });

      if (!result?.path) {
        showAlert('error', 'Không thể lấy đường dẫn ảnh.');
        return;
      }

      const file = {
        path: result.path,
        id: result.sourceURL || result.path.split('/').pop(),
        type: result.mime || 'image/jpeg',
      };

      setAvatar(file.path); // Cập nhật avatar tạm thời

      const success = await handleChangeAvatar(userProfile.oauthId, file);
      if (success) {
        showAlert('success', 'Cập nhật ảnh đại diện thành công!');
      } else {
        showAlert('error', 'Cập nhật ảnh đại diện thất bại.');
        setAvatar(userProfile?.avatar || DEFAULT_AVATAR); // Khôi phục avatar cũ
      }
    } catch (error) {
      console.error('Lỗi chọn ảnh:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        showAlert('error', error.message || 'Lỗi khi chọn ảnh.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 px-4 pt-4 bg-white mt-[50px]">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-gray-500 text-base">Hủy</Text>
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Chỉnh sửa trang cá nhân</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Text className="text-gray-500 text-base">{isLoading ? 'Đang lưu...' : 'Xong'}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex items-center mb-6">
        <TouchableOpacity onPress={selectImage} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Image
              style={{ width: 100, height: 100, borderRadius: 50 }}
              source={{ uri: avatar }}
              defaultSource={{ uri: DEFAULT_AVATAR }}
            />
          )}
        </TouchableOpacity>
        <Text className="text-black mt-4 mb-1 text-2xl font-bold">
          {userProfile?.fullname || 'Người dùng'}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-black mb-1">Tiểu sử</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Nhập tiểu sử..."
          placeholderTextColor="#666"
          className="border border-gray-400 rounded-md px-3 py-2 text-black"
          multiline
          editable={!isLoading}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;