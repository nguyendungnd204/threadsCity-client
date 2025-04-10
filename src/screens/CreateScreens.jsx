import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import UserImageIcon from '../components/UserImageIcon'


const CreateScreens = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-row items-center mt-5 border-b-2 border-gray-300 pb-2'>
        <UserImageIcon source={require('../assets/images/threads-logo-black.png')} 
          className="self-start"
        />
        <View>
          <Text className='text-[20px] font-bold'>Nguyễn Văn Dũng</Text>
          <TextInput
            placeholder='Nhập nội dung bài viết...'
            placeholderTextColor='gray'
            className='max-h-[100px] text-[16px] text-gray-500'
            autoFocus={true}
          />
        </View>
        <View>
        
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CreateScreens