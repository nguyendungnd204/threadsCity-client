import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import Feed from '../../components/Feed';
import { icons } from '../../constants/icons';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getThread, getThreadFollowingUser } from '../../services/threadService';
import useFetch from '../../services/useFetch';
import { getUserById } from '../../services/userService';

const HomScreen = () => {
  const TabSelect = ["Dành cho bạn", "Đang theo dõi"];
  const [tab, setTab] = useState("Dành cho bạn");
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);
  const { data: thread, loading, error, refetch } = useFetch(() => getThread(), true);
  const { data: followingThread, loading: followThreadLoading, refetch: followThreadRefetch } = useFetch(() => getThreadFollowingUser(user?.oauthId), true);

  const flatListRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await Promise.all([refetch(), followThreadRefetch()]);
      };
      refreshData();
    }, [])
  );
  // State cho phân trang của tab "Dành cho bạn"
  const threadPageSize = 5;
  const [threadCurrentPage, setThreadCurrentPage] = useState(1);
  const [threadRenderedData, setThreadRenderedData] = useState([]);
  const [isThreadLoading, setIsThreadLoading] = useState(false);

  // State cho phân trang của tab "Đang theo dõi"
  const followedPageSize = 5;
  const [followedCurrentPage, setFollowedCurrentPage] = useState(1);
  const [followedRenderedData, setFollowedRenderedData] = useState([]);
  const [isFollowedLoading, setIsFollowedLoading] = useState(false);

  // Hàm phân trang
  const pagination = (database, pageSize, page) => {
    // Kiểm tra nếu database là null hoặc undefined, trả về mảng rỗng
    if (!database || !Array.isArray(database)) {
      return [];
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (start > database.length) {
      return [];
    }
    return database.slice(start, end);
  };

  useEffect(() => {
    if (thread && tab === "Dành cho bạn") {
      setIsThreadLoading(true);
      const data = pagination(thread, threadPageSize, threadCurrentPage);
      if (threadCurrentPage === 1) {
        setThreadRenderedData(data);
      }
      setIsThreadLoading(false);
    }
  }, [thread, threadPageSize, threadCurrentPage, tab]);

  useEffect(() => {
    if (followingThread && tab === "Đang theo dõi") {
      setIsFollowedLoading(true);
      const data = pagination(followingThread, followedPageSize, followedCurrentPage);
      if (followedCurrentPage === 1) {
        setFollowedRenderedData(data);
      }   
      setIsFollowedLoading(false);
    }
  }, [followingThread, followedPageSize, followedCurrentPage, tab]);

  const handleThread = (id) => {
    navigation.navigate('FeedDetail', { id });
  };

  const onRefresh = async () => {
    if (loading || followThreadLoading || isThreadLoading || isFollowedLoading) {
      return; 
    }

    if (tab === "Dành cho bạn") {
      setThreadCurrentPage(1);
      setThreadRenderedData([]); 
    } else if (tab === "Đang theo dõi") {
      setFollowedCurrentPage(1);
      setFollowedRenderedData([]); 
    }

    await Promise.all([refetch(), followThreadRefetch()]);
  };
  const getDisplayData = () => {
    if (tab === "Dành cho bạn") {
      return threadRenderedData; 
    } else if (tab === "Đang theo dõi") {
      return followedRenderedData; 
    }
    return [];
  };

  const renderFooter = () => {
    if (loading || followThreadLoading || isThreadLoading || isFollowedLoading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }
    return null;
  };

  const handleEndReached = () => {
    if (loading || followThreadLoading || isThreadLoading || isFollowedLoading) {
      return;
    }
    if (tab === "Dành cho bạn" && !isThreadLoading) {
      if (!thread || !Array.isArray(thread)) {
        setIsThreadLoading(false);
        return;
      }
      setIsThreadLoading(true);
      const contentToAppend = pagination(thread, threadPageSize, threadCurrentPage + 1);
      if (contentToAppend.length > 0) {
        setThreadRenderedData(prev => [...prev, ...contentToAppend]);
        setThreadCurrentPage(threadCurrentPage + 1);
      }
      setIsThreadLoading(false);
    } else if (tab === "Đang theo dõi" && !isFollowedLoading) {
      if (!followingThread || !Array.isArray(followingThread)) {
        setIsFollowedLoading(false);
        return;
      }
      setIsFollowedLoading(true);
      const contentToAppend = pagination(followingThread, followedPageSize, followedCurrentPage + 1);
      if (contentToAppend.length > 0) {
        setFollowedRenderedData([...followedRenderedData, ...contentToAppend]);
        setFollowedCurrentPage(followedCurrentPage + 1);
      }
      setIsFollowedLoading(false);
    }
  };

  useEffect(() => {
    setThreadCurrentPage(1);
    setFollowedCurrentPage(1);
    if (thread) {
      setThreadRenderedData(pagination(thread, threadPageSize, 1));
    }
    if (followingThread) {
      setFollowedRenderedData(pagination(followingThread, followedPageSize, 1));
    }
  }, [tab, thread, followingThread]);
  

  return (
    <View className="flex-1 mt-[50px]">
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.8}
        onEndReached={handleEndReached}
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
                <TouchableOpacity key={item} className="items-center" onPress={() => setTab(item)}>
                  <Text className={`text-xl font-bold ${tab === item ? 'text-black' : 'text-gray-300'}`}>
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