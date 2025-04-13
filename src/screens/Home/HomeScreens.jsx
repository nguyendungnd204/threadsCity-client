import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import Feed from '../../components/Feed';
import { icons } from '../../constants/icons';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getThread } from '../../services/threadService';
import useFetch from '../../services/useFetch';

const HomScreen = () => {
  const TabSelect = ["Dành cho bạn", "Đang theo dõi"];
  const [tab, setTab] = useState("Dành cho bạn");
  const { user } = useAuth();
  const navigation = useNavigation();
  
  // Sử dụng useFetch để lấy dữ liệu
  const { data: thread, loading, error, refetch } = useFetch(getThread, true);

  const handleThread = (id) => {
    navigation.navigate('FeedDetail', { id });
  };

  const onRefresh = async () => {
    // Gọi lại refetch để tải lại dữ liệu
    refetch();
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }
    return null;
  };

  return (
    <View className='flex-1 mt-[50px]'>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={thread || []}
        keyExtractor={(item) => item.threadid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleThread(item.threadid)}>
            <Feed thread={item} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View>
            <Image source={icons.threads_logo_black} className='w-20 h-20 self-center' />
            <View className='flex-row flex-1 justify-around py-2'>
              {TabSelect.map((item) => (
                <TouchableOpacity
                  key={item}
                  className='items-center'
                  onPress={() => setTab(item)}
                >
                  <Text className={`text-base font-bold ${tab === item ? 'text-black' : 'text-gray-300'}`}>
                    {item}
                  </Text>
                  <View className={`mt-1 h-[2] w-[210] rounded-full ${tab === item ? 'bg-black' : 'bg-gray-300'}`} />
                </TouchableOpacity>
              ))}
            </View>
            <CreateThreadsComponents isPreview={true} user={user} />
          </View>
        }
        ItemSeparatorComponent={() => (
          <View className='border-b-hairline border-b-gray-400 bg-gray-100' />
        )}
        className='bg-white'
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={renderFooter} // Hiển thị loading hoặc thông báo lỗi dưới cùng
      />
    </View>
  );
};

export default HomScreen;
