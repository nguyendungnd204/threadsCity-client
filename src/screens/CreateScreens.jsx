import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import UserImageIcon from '../components/UserImageIcon'
import CreateIcons from '../components/CreateIcons'
import { useAuth } from '../Auth/AuthContext';
import CreateThreadsComponents from '../components/CreateThreadsComponents';
import ImagePicker from 'react-native-image-crop-picker';
const CreateScreens = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const { user } = useAuth();




  return (
    <>
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 flex-col'>
          <CreateThreadsComponents/>
          <View className='flex-row mt-auto pb-[50px] px-[20px] items-center'>
            <Text className='text-[16px]'>
              Bất kỳ ai cũng có thể trả lời và trích dẫn
            </Text>
            <TouchableOpacity className='ml-auto w-[70px] h-[40px] bg-[#000] rounded-[20px] items-center justify-center'>
              <Text className='text-[#fff] text-[16px]'>Đăng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
    
  )
}

export default CreateScreens