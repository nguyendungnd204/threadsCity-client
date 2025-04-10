import { View, Text, TextInput, Image, TouchableOpacity, LayoutAnimation, Keyboard, FlatList} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed';
import ProfileSearchResult from '../components/ProfileSearchResult'


const SearchScreens = () => {
  const [status, setStatus] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const users = [
    {
      id: 1,
      uri: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
      username: 'Nguyễn Văn A',
      firstName: 'Nguyen',
      lastName: 'A',
      followCount: 10,
      status: false,
    },
    {
      id: 2,
      uri: 'https://randomuser.me/api/portraits/women/2.jpg',
      username: 'Trần Thị B',
      firstName: 'Nguyen',
      lastName: 'A',
      followCount: 310,
      status: true,
    },
    {
      id: 3,
      uri: 'https://randomuser.me/api/portraits/men/3.jpg',
      username: 'Lê Văn C',
      firstName: 'Nguyen',
      lastName: 'A',
      followCount: 11230,
      status: false,
    },
    {
      id: 4,
      uri: 'https://randomuser.me/api/portraits/women/4.jpg',
      username: 'Phạm Thị D',
      firstName: 'Nguyen',
      lastName: 'A',
      followCount: 10000000000000,
      status: false,
    },
  ];
  

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
      <View className='flex-row items-center px-4'>
        {status && ( 
          <TouchableOpacity className='mr-2' onPress={() => { 
            toggleStatus(false);
            setTimeout(() => {
              Keyboard.dismiss();
            }, 100) 
          }}>
            <Image source={require("./../assets/images/back.png")} className='size-6 mt-3'/>
          </TouchableOpacity>
        )}
        <View className='flex-1 flex-row items-center bg-gray-200 rounded-full px-4 py-2 mt-3 shadow-sm'>
            <Image
              source={require('./../assets/images/search.png')}
              className='w-5 h-5'
              resizeMode='contain'
              tintColor='#9ca3af' // xám nhạt
            />
            <TextInput
              placeholder='Tìm kiếm người dùng...'
              placeholderTextColor='#9ca3af'
              value={searchTerm}
              onChangeText={handleSearch}
              onFocus={() => toggleStatus(true)}
              className='flex-1 ml-3 text-base text-black'
            />
          </View>

      </View>
      <View className='flex-1 px-3 py-4'>
        <FlatList
          data={users}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentInsetAdjustmentBehavior="automatic"
          ItemSeparatorComponent={() => (
            <View className='border-b-hairline border-b-gray-400 bg-gray-100' />
          )} 
          ListEmptyComponent={() => <Text style={styles.emptyText}>No users found</Text>}
          renderItem={({ item }) => (
              <ProfileSearchResult Users={item} handleFollow={() => { !item.status }}/> 
          )}
          contentContainerStyle={{ gap: 8}}
        />
      </View>
      
    </SafeAreaView>
  )
}

export default SearchScreens