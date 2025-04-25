import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import Feed from '../../components/Feed';
import { icons } from '../../constants/icons';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getThread, getUserThreads } from '../../services/threadService';
import useFetch from '../../services/useFetch';
import { getUserById } from '../../services/userService';
import { getFollowings } from '../../services/followService';

const HomScreen = () => {
  const TabSelect = ["Dành cho bạn", "Đang theo dõi"];
  const [tab, setTab] = useState("Dành cho bạn");
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);
  const { data: thread, loading, error, refetch } = useFetch(() => getThread(), true);
  const { data: following, loading: followLoading, refetch: followRefetch } = useFetch(() => getFollowings(user?.oauthId), true);
  const [followedThreads, setFollowedThreads] = useState([]); 
  const [followedThreadsLoading, setFollowedThreadsLoading] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchFollowedThreads = async () => {
      if (!following || following.length === 0) {
        setFollowedThreads([]);
        return;
      }

      setFollowedThreadsLoading(true);
      try {
        
        const thread = following.map((userId) => getUserThreads(userId)); // lấy bài viết của người dùng
        const threadResults = await Promise.all(thread);  // đẩy vào 1 mảng trong đó mỗi mảng là các bài viết của 1 người dùng
       
        const ThreadListForFollow = threadResults.flat(); // đẩy dữ liệu về thành 1 mảng 
        const sortThreads = ThreadListForFollow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo createdAt giảm dần
        setFollowedThreads(sortThreads);
      } catch (err) {
        console.error('Error fetching followed threads:', err);
      } finally {
        setFollowedThreadsLoading(false);
      }
    };

    fetchFollowedThreads();
  }, [following]);

  const handleThread = (id) => {
    navigation.navigate('FeedDetail', { id });
  };

  const onRefresh = async () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    refetch(); // Refetch all threads
    followRefetch(); // Refetch followed users
  };

  // Determine which data to show based on the tab
  const getDisplayData = () => {
    if (tab === "Dành cho bạn") {
      return thread || [];
    } else if (tab === "Đang theo dõi") {
      return followedThreads || [];
    }
    return [];
  };

  const renderFooter = () => {
    if (loading || followedThreadsLoading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }
    return null;
  };

  return (
    <View className="flex-1 mt-[50px]">
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        data={getDisplayData()} 
        keyExtractor={(item) => item.threadid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleThread(item.threadid)}>
            <Feed thread={item} key={item.threadid} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View>
            <Image source={icons.threads_logo_black} className="w-20 h-20 self-center" />
            <View className="flex-row flex-1 justify-around py-2">
              {TabSelect.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="items-center"
                  onPress={() => setTab(item)}
                >
                  <Text
                    className={`text-base font-bold ${tab === item ? 'text-black' : 'text-gray-300'}`}
                  >
                    {item}
                  </Text>
                  <View
                    className={`mt-1 h-[2] w-[210] rounded-full ${tab === item ? 'bg-black' : 'bg-gray-300'}`}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {tab === "Dành cho bạn" && <CreateThreadsComponents isPreview={true} user={userProfile} />}
          </View>
        }
        ItemSeparatorComponent={() => <View className="border-b-2 border-b-gray-300" />}
        className="bg-white"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default HomScreen;