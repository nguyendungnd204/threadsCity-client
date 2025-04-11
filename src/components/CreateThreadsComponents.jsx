import { View, Text,TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import UserImageIcon from '../components/UserImageIcon'
import CreateIcons from '../components/CreateIcons'
import ImagePicker from 'react-native-image-crop-picker'

const CreateThreadsComponents = () => {

    const selectImage = (type) => {
        if (type === 'camera') {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
              }).then(image => {
                console.log(image);
              });
        } else if (type === 'gallery') {
            ImagePicker.openPicker({
                multiple: true
              }).then(images => {
                console.log(images);
              });
        }
    }

  return (
    <View className='flex-row mt-5 border-b-2 border-gray-300 pb-2'>
        <UserImageIcon source={require('../assets/images/threads-logo-black.png')} className='self-start'/>
        <View>
        {/* {user.dispName} */}
            <Text className='text-[20px] font-bold'>Nguyễn Văn Dũng</Text>
            <TextInput
            placeholder='Có gì mới...'
            placeholderTextColor='gray'
            multiline={true} 
            className='text-[16px] text-gray-500 w-[300px]'
            autoFocus={true}
            style={{ textAlignVertical: 'top' }}
            />
            <View className='flex-row m-[12px] '>
            <TouchableOpacity onPress={() => selectImage('camera')} className='mr-[16px]'>
                <CreateIcons source={require('../assets/images/camera.png')}/>
            </TouchableOpacity>
            <TouchableOpacity   className='mr-[16px]'>
                <CreateIcons source={require('../assets/images//microphone.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('gallery')} className='mr-[16px]'>
                <CreateIcons source={require('../assets/images/image-gallery.png')}/>
            </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity className='ml-[12px] self-start'>
            <CreateIcons source={require('../assets/images/close.png')}/>
        </TouchableOpacity>
    </View>
  )
}

export default CreateThreadsComponents