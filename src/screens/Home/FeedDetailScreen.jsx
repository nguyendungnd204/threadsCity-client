import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getThreadById } from '../../services/threadService';
import React from 'react';
import Feed from '../../components/Feed';
import { ActivityIndicator } from 'react-native-paper';
import Comments from '../../components/Comments';
import useFetch from '../../services/useFetch';
import { useAuth } from '../../Auth/AuthContext';
import { getUserById } from '../../services/userService';

const FeedDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [thread, setThread] = React.useState(null); // dùng null để phân biệt đang loading
  const { user } = useAuth();
  const {data: userProfile} = useFetch(() => getUserById(user?.oauthId), true);
  
  React.useEffect(() => {
      if (user && user.oauthId) {
        console.log('User ID:', user.oauthId);
        console.log('User Profile:', userProfile);
      }
      console.log(id)
  }, [userProfile, id]);
  
  React.useEffect(() => {
    
    const fetchThread = async () => {
      const result = await getThreadById(id);
      setThread(result); // nếu không có cũng là null
    };
    fetchThread();
  }, [id]);

  const handlePress = (threadId) => {
    navigation.navigate('Reply', { threadId });
  };


  return (
    <View className='flex-1 bg-white mb-0'>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {thread ? (
          <>
            <Feed thread={thread} />
            <View className='border-b-2 border-b-gray-300 ' />
          </>
        ) : (
          <ActivityIndicator size="large" className='mt-10' />
        )}
        <Comments/>
      </ScrollView>
      <View className=' bg-gray-200 my-0.5'>
      <TouchableOpacity className='flex-row items-center rounded-full gap-2.5 p-2 m-1.5' onPress={() => handlePress(id)} >
          <Image source={{ uri: userProfile?.avatar}} className='w-[40px] h-[40px] rounded-full' />
          <Text>Gửi đến {thread?.fullname}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedDetailScreen;
