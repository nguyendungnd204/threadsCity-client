import { View, Image } from 'react-native'
import React from 'react'

const UserImageIcon = ({ source }) => {
  return (
    <View>
      <Image className="w-[50px] h-[50px] rounded-full" source={source} />
    </View>
  )
}

export default UserImageIcon