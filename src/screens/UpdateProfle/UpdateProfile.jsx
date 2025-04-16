import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserImageIcon from '../../components/UserImageIcon';
import { updateUserBio } from '../../services/userService'; 

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = route.params || {};

  const [bio, setBio] = useState(userProfile?.bio || '');

  const handleSave = async () => {
    const success = await updateUserBio(userProfile.userId, bio);
    if (success) {
      navigation.goBack();
    } else {
      alert("Cập nhật tiểu sử thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} className="flex-1 px-4 pt-4 mt-[50px]">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-black-500 text-base">Huỷ</Text>
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Chỉnh sửa trang cá nhân</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-black-500 text-base">Xong</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-6">
      <UserImageIcon
          source={{ uri: userProfile?.avatar || 'https://your-avatar-url.jpg' }}
        />
        <Text className="text-black pl-3 text-base font-semibold">
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
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
