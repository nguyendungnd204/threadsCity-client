import { View, Text, TextInput, Image, TouchableOpacity, LayoutAnimation, Keyboard, FlatList} from 'react-native'
import React from 'react'
import ProfileSearchResult from '../../components/ProfileSearchResult'
import { icons } from '../../constants/icons'
import { getUserByName } from '../../services/userService'

const SearchScreens = () => {
  const [status, setStatus] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [users, setUsers] = React.useState([])


  React.useEffect(() => {
    const fetchUsers = setTimeout(async () => {
      if (searchTerm.trim() !== '') {
        const result = await getUserByName(searchTerm.trim());
        
        setUsers(result || []);
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(fetchUsers)
  }, [searchTerm]);

  const handleSearch = (searchTerm) => {
      setSearchTerm(searchTerm)
  }
  const toggleStatus = (value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStatus(value);
    setUsers([]);
    setSearchTerm('');
}
  return (
     <View className='flex-1 mt-[50px] bg-white'>
      {!status &&  <Text className='px-5 py-2 text-3xl font-bold'>Tìm kiếm</Text> }
      <View className='flex-row items-center px-4'>
        {status && ( 
          <TouchableOpacity className='mr-2' onPress={() => { 
            toggleStatus(false);
            setTimeout(() => {
              Keyboard.dismiss();
            }, 100) 
          }}>
            <Image source={icons.back} className='size-6 mt-3'/>
          </TouchableOpacity>
        )}
        <View className='flex-1 flex-row items-center bg-gray-200 rounded-full px-4 py-2 mt-3 shadow-sm'>
            <Image
              source={icons.search}
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
            <View className='border-b-2 border-b-gray-300' />
          )} 
          ListEmptyComponent={() => <Text className='text-base text-center mt-4 text-gray-300'>Không tìm thấy người dùng</Text>}
          renderItem={({ item }) => (
              <ProfileSearchResult userId={item.id}/> 
          )}
          contentContainerStyle={{ gap: 8}}
        />
      </View>
        
    </View>
  )
}

export default SearchScreens