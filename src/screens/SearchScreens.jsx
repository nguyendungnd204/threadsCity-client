import { View, Text, TextInput, Image, TouchableOpacity, LayoutAnimation, Keyboard, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed';


const SearchScreens = () => {
  const [status, setStatus] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (searchTerm) => {
      setSearchTerm(searchTerm)
  }
  const toggleStatus = (value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStatus(value);
}
  return (
    <SafeAreaView className='flex-1 bg-white'>
      {!status &&  <Text className='px-5 text-3xl font-bold'>SearchScreens</Text> }
      <View className='flex-row items-center'>
        {status && ( 
          <TouchableOpacity className='mr-2' onPress={() => { 
            toggleStatus(false);
            setTimeout(() => {
              Keyboard.dismiss();
            }, 100) 
          }}>
            <Image source={require("./../assets/images/back.png")} className='size-6 top-3'/>
          </TouchableOpacity>
        )}
        <View className='flex-row items-center bg-gray-300 rounded-full px-5 py-2 top-3 flex-1'>
          <Image source={require("./../assets/images/search.png")} className='size-5' resizeMode='contain' tintColor='#00000'/>
          <TextInput
            placeholder='Search ...'
            placeholderTextColor="#000000"
            value={searchTerm}
            onChangeText={handleSearch}
            onFocus={() => toggleStatus(true)}
            className='flex-1 ml-2 text-black' />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SearchScreens