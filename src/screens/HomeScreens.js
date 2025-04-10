import { View, Text, Image, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, {useState} from 'react'
import UserImageIcon from '../components/UserImageIcon'
import { useAuth } from '../Auth/AuthContext';
const HomScreen = () => {
  const { user, isGuest } = useAuth();
  return (
    <>
      {user ? (
        <SafeAreaView className=''>
          <View className='justify-center items-center'>
            {/* <Image source={require('../assets/images/threads-logo-black.png')}
              className='w-[10px] h-[10px] '
            /> */}
          </View>
          <View className='flex-row items-center mt-5'>
            {/* <UserImageIcon source={require('../assets/images/threads-logo-black.png')} 
              style={{ alignSelf: 'flex-start' }}
            /> */}
            <View>
              <Text className='text-[20px] font-bold'>{user.displayName}</Text>
              <TextInput
                placeholder='Nhập nội dung bài viết...'
                className='max-h-[100px] text-[16px] '
              />
            </View>
          </View>
      </SafeAreaView>
      ) : null}
    </>
  )
}

export default HomScreen