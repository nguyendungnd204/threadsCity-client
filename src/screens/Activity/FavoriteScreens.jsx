import { View, Text, TouchableOpacity, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import FollowerActivity from '../../components/FollowerActivity';
import Feed from '../../components/Feed';
import { useAuth } from '../../Auth/AuthContext';
import { getAllCommentsForUser, getCommentByUserId } from '../../services/commentService';
import useFetch from '../../services/useFetch';
import { getRepostThread, getThreadById } from '../../services/threadService';
import { getFollowers } from '../../services/followService';
import { getUserById } from '../../services/userService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình để tính toán

const ActivityScreens = () => {
  const { user } = useAuth();
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const { data: follower, loading: followerLoading, refetch: refetchFollower } = useFetch(() => getFollowers(user?.oauthId), true);
  const { data: threadReply, loading: replyLoading, refetch: refetchReply } = useFetch(() => getAllCommentsForUser(user?.oauthId), true);
  const { data: repostThread, loading: repostLoading, refetch: refetchRepostThread } = useFetch(() => getRepostThread(user?.oauthId), true);
  const [threadReposted, setThreadReposted] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  useEffect(() => {
    const fetchUserProfileFollowers = async () => {
      if (Array.isArray(follower) && follower.length > 0) {
        const profile = await Promise.all(
          
          follower.map((item) => {
            console.log("id", item)
            return getUserById(item);
          })
        );      
        const result = profile.flat()
        setUserProfile(result);
        console.log('User: ', result)
      } else {
        setUserProfile([]);
      }

    }
    fetchUserProfileFollowers();
    console.log("follower", userProfile)
  }, [follower]);
  
  useEffect(() => {  
    const fetchRepostedThreads = async () => {
      if (repostThread && repostThread.length > 0) {
        const threads = await Promise.all(
          repostThread.map((item) => getThreadById(item.parentThreadId))
        );
        setThreadReposted(threads.filter(thread => thread !== null));
      } else {
        setThreadReposted([]);
      }
    };
    fetchRepostedThreads();
    console.log('repostThread:', repostThread);
  }, [repostThread]);

  const Tabs = [
    { name: 'Tất cả' },
    { name: 'Lượt theo dõi' },
    { name: 'Bài đăng lại' },
    { name: 'Thread trả lời' },
  ];
  const [tabIndex, setTabIndex] = useState('Tất cả');
  const tabFlatListRef = useRef(null); // Ref để điều khiển FlatList của tab

  // Tính toán chỉ số của tab đang chọn
  const selectedTabIndex = Tabs.findIndex((tab) => tab.name === tabIndex);

  // Tự động cuộn đến tab đang chọn khi tabIndex thay đổi
  useEffect(() => {
    if (tabFlatListRef.current && selectedTabIndex !== -1) {
      tabFlatListRef.current.scrollToIndex({
        index: selectedTabIndex,
        animated: true,
        viewPosition: 0.5, // Căn giữa tab đang chọn
      });
    }
  }, [selectedTabIndex]);

  // Xử lý khi người dùng nhấn vào tab
  const handleTabPress = (tabName) => {
    setTabIndex(tabName);
  };

  // Render từng tab
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

  // Gộp dữ liệu threadReply và threadReposted cho tab "Tất cả"
  const allActivities = [
    ...(threadReply || []).map(item => ({ ...item, type: 'reply' })), // Thêm type để phân biệt
    ...(threadReposted || []).map(item => ({ ...item, type: 'repost' })), // Thêm type để phân biệt
    // ...(userProfile || []).map(item => ({ ...item, type: 'userProfile' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo ngày giảm dần

  // Dữ liệu cho các tab
  const activityData = {
    'Tất cả': allActivities,
    'Lượt theo dõi': (userProfile || []).map((item) => ({ ...item, type: 'userProfile' })), // Đảm bảo type cho tab "Lượt theo dõi"
    'Bài đăng lại': (threadReposted || []).map((item) => ({ ...item, type: 'repost' })),
    'Thread trả lời': (threadReply || []).map((item) => ({ ...item, type: 'reply' })),
  };

  const onRefresh = async () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    await Promise.all([refetchReply(), refetchRepostThread(), refetchFollower()]);
  };

  // Dữ liệu cho FlatList chính (gồm header và danh sách hoạt động)
  const data = [
    { type: 'header' }, // Phần tiêu đề "Hoạt động"
    { type: 'tabs' },   // Phần tab (sẽ làm sticky)
    { type: 'activities' }, // Phần danh sách hoạt động
  ];

  // Hàm xử lý khi nhấn vào thread
  const handleThread = (threadId) => {
    console.log('Navigating to thread with ID:', threadId);
    // Thêm logic điều hướng đến thread tại đây
    navigation.navigate('FeedDetail', { id: threadId });
  };

  const handleUserProfile = (id) => {
    navigation.navigate("UserProfile", { id });
  };
  // Render từng mục trong FlatList chính
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
                    <Feed thread={item} />
                  </TouchableOpacity>
                );
              }
            }}
            ItemSeparatorComponent={() => <View className="border-b-2 border-b-gray-300" />}
            keyExtractor={(item, index) => {
              // Đảm bảo key duy nhất bằng cách kết hợp id//userId với type và index
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

  if (followerLoading || replyLoading || repostLoading ) return <ActivityIndicator size="small" color="#0000ff" />;
  

  return (
    <View className="flex-1 mt-[50px] bg-white px-5">
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        stickyHeaderIndices={[1]} // Phần tab (index 1) sẽ là sticky header
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ followerLoading || replyLoading || repostLoading} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default ActivityScreens;