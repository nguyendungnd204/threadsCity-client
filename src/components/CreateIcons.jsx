import { View, Text, Image } from 'react-native'
import React from 'react'

const CreateIcons = ({source}) => {
  return (
    <View>
        <Image className="w-[28px] h-[28px] " source={source} />
    </View>
  )
}

export default CreateIcons