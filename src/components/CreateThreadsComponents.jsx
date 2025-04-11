import { View, Text,TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import UserImageIcon from '../components/UserImageIcon'
import CreateIcons from '../components/CreateIcons'
import ImagePicker from 'react-native-image-crop-picker'
import PropTypes from 'prop-types'
import { useNavigation } from '@react-navigation/native';
import { icons } from '../constants/icons'

const CreateThreadsComponents = ({ isPreview }) => {

    const navigation = useNavigation();
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
        <View className='flex-row mt-5 border-b-2 border-gray-300 pb-2'>
          <UserImageIcon source={icons.threads_logo_black} className='self-start'/>
          <View>
          {/* {user.dispName} */}
              <Text className='text-[20px] font-bold'>Nguyễn Văn Dũng</Text>
              <TextInput
              placeholder='Có gì mới...'
              placeholderTextColor='gray'
              multiline={true} 
              className='text-[16px] text-gray-500 w-[300px]'
              autoFocus={!isPreview}
              style={{ textAlignVertical: 'top' }}
              />
              <View className='flex-row m-[12px] '>
              <TouchableOpacity onPress={() => selectImage('camera')} className='mr-[16px]'>
                  <CreateIcons source={icons.camera}/>
              </TouchableOpacity>
              <TouchableOpacity   className='mr-[16px]'>
                  <CreateIcons source={icons.microphone} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectImage('gallery')} className='mr-[16px]'>
                  <CreateIcons source={icons.gallery}/>
              </TouchableOpacity>
              </View>
          </View>
          <TouchableOpacity className='ml-[12px] self-start'>
              <CreateIcons source={icons.close}/>
          </TouchableOpacity>
      </View>
    </TouchableOpacity>  
  )
}

CreateThreadsComponents.PropTypes = {
  isPreview: PropTypes.bool,
}
export default CreateThreadsComponents