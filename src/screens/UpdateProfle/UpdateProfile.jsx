import React, { useState } from 'react';
import { View, Text, TextInput, Image, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const navigation = useNavigation();
  const [showInstagram, setShowInstagram] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [bio, setBio] = useState('');

  return (
    
    <ScrollView className="flex-1 bg-white mt-[50px]  px-4 pt-4">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 text-base">Huỷ</Text>
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Chỉnh sửa trang cá nhân</Text>
        <TouchableOpacity>
          <Text className="text-blue-500 text-base">Xong</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center mb-6">
        <Image
          source={{ uri: 'https://your-avatar-url.jpg' }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <Text className="text-black text-base font-semibold">Nguyễn Văn Dũng</Text>
      </View>

      <View className="mb-4">
        <Text className="text-black mb-1">Tiểu sử</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Nhập tiểu sử..."
          placeholderTextColor="#666"
          className="border border-gray-400 rounded-md px-3 py-2 text-black"
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
