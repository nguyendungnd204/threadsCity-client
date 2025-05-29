import { View, Text, TouchableOpacity, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect, use } from 'react';
import FollowerActivity from '../../components/FollowerActivity';
import Feed from '../../components/Feed';
import { useAuth } from '../../Auth/AuthContext';
import { getAllCommentsForUser } from '../../services/commentService';
import useFetch from '../../services/useFetch';
import { getRepostThread } from '../../services/threadService';
import { getUserFollowersProfile } from '../../services/followService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window'); 

const ActivityScreens = () => {
  const { user } = useAuth();
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const { data: threadReply, loading: replyLoading, refetch: refetchReply } = useFetch(() => getAllCommentsForUser(user?.oauthId), true);
  const { data: repostThread, loading: repostLoading, refetch: refetchRepostThread } = useFetch(() => getRepostThread(user?.oauthId), true);
  const { data: userProfile, loading: userProfileLoading, refetch: refetchUserProfile } = useFetch(() => getUserFollowersProfile(user?.oauthId), true);

  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await Promise.all([
          refetchReply(),
          refetchRepostThread(),
          refetchUserProfile(),
        ]);
      };
      refreshData();
    }, [])
  );
  
  const Tabs = [
    { name: 'Tất cả' },
    { name: 'Lượt theo dõi' },
    { name: 'Bài đăng lại' },
    { name: 'Thread trả lời' },
  ];
  const [tabIndex, setTabIndex] = useState('Tất cả');
  const tabFlatListRef = useRef(null); 

  const selectedTabIndex = Tabs.findIndex((tab) => tab.name === tabIndex);

  useEffect(() => {
    if (tabFlatListRef.current && selectedTabIndex !== -1) {
      tabFlatListRef.current.scrollToIndex({
        index: selectedTabIndex,
        animated: true,
        viewPosition: 0.5, 
      });
    }
  }, [selectedTabIndex]);

  const handleTabPress = (tabName) => {
    setTabIndex(tabName);
  };

  const renderTab = ({ item, index }) => {
    const isSelected = tabIndex === item.name;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleTabPress(item.name)}
        className={`py-2 px-6 items-center rounded-full border border-gray-300 ${isSelected ? 'border-black bg-black' : ' bg-white'}`}
      >
        <Text className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-black'}`}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const allActivities = [
    ...(threadReply || []).map(item => ({ ...item, type: 'reply' })), 
    ...(repostThread || []).map(item => ({ ...item, type: 'repost' })), 
    ...(userProfile || []).map(item => ({ ...item, type: 'userProfile' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 

  const activityData = {
    'Tất cả': allActivities,
    'Lượt theo dõi': (userProfile || []).map((item) => ({ ...item, type: 'userProfile' })), 
    'Bài đăng lại': (repostThread || []).map((item) => ({ ...item, type: 'repost' })),
    'Thread trả lời': (threadReply || []).map((item) => ({ ...item, type: 'reply' })),
  };

  const onRefresh = async () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    await Promise.all([refetchReply(), refetchRepostThread(), refetchUserProfile()]);
  };

  const data = [
    { type: 'header' }, 
    { type: 'tabs' },   
    { type: 'activities' }, 
  ];

  const handleThread = (threadId) => {
    console.log('Navigating to thread with ID:', threadId);
    navigation.navigate('FeedDetail', { id: threadId });
  };

  const handleUserProfile = (id) => {
    navigation.navigate("UserProfile", { id });
  };
  const renderItem = ({ item, index }) => {
    if (item.type === 'header') {
      return (
        <View className="mb-1">
          <Text className="text-3xl font-bold py-3">Hoạt động</Text>
        </View>
      );
    } else if (item.type === 'tabs') {
      return (
        <View className="bg-white">
          <FlatList
            ref={tabFlatListRef}
            data={Tabs}
            renderItem={renderTab}
            keyExtractor={(item, index) => item.name + index}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5, gap: 8, paddingVertical: 8 }}
            snapToAlignment="center"
            snapToInterval={width / 4}
            decelerationRate="fast"
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 200));
              wait.then(() => {
                tabFlatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
          />
        </View>
      );
    } else if (item.type === 'activities') {
      const currentActivities = activityData[tabIndex] || [];
      const hasActivities = currentActivities.length > 0;

      return (
        <View className="flex-1 mt-4">
          {hasActivities && (
            <Text className="text-xl font-bold mb-2">Trước đó</Text>
          )}
          <FlatList
            data={currentActivities}
            renderItem={({ item }) => {
              if (item.type === 'userProfile') {
                return (
                  <TouchableOpacity onPress={() => handleUserProfile(item.userId)}>
                    <FollowerActivity Users={item} />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity onPress={() => handleThread(item.threadid || item.id)}>
                    <Feed thread={item} refetch={refetchReply} followThreadRefetch={refetchRepostThread}/>
                  </TouchableOpacity>
                );
              }
            }}
            ItemSeparatorComponent={() => <View className="border-b-2 border-b-gray-300" />}
            keyExtractor={(item, index) => {
              const itemId = item.threadid || item.id || item.userId || `item-${index}`;
              return `${item.type}-${itemId}-${index}`;
            }}
            ListEmptyComponent={
              <Text className="text-xl text-gray-400 text-center mt-[300px]">Chưa có gì để xem ở đây.</Text>
            }
          />
        </View>
      );
    }
    return null;
  };

  if (userProfileLoading || replyLoading || repostLoading ) return <ActivityIndicator size="small" color="#0000ff" />;
  

  return (
    <View className="flex-1 mt-[50px] bg-white px-5">
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ userProfileLoading || replyLoading || repostLoading} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default ActivityScreens;