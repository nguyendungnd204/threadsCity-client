import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useMemo } from 'react';
import FollowerActivity from '../../components/FollowerActivity';
import Feed from '../../components/Feed';
import CheckAuth from '../../components/CheckAuth';
import { useAuth } from "../../Auth/AuthContext";
import auth from "@react-native-firebase/auth";

const ActivityScreens = () => {
  const { user } = useAuth();
  const Tabs = [
    { name: 'Tất cả' },
    { name: 'Lượt theo dõi' },
    { name: 'Bài đăng lại' },
    { name: 'Follow' },
  ];
  const [tabIndex, setTabIndex] = useState('Tất cả');

  const users = [
    { id: 1, uri: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg', username: 'Nguyễn Văn A', date: '2 ngày trước', status: false },
    { id: 2, uri: 'https://randomuser.me/api/portraits/women/2.jpg', username: 'Trần Thị B', date: '1 tuần trước', status: true },
    { id: 3, uri: 'https://randomuser.me/api/portraits/men/3.jpg', username: 'Lê Văn C', date: 'Hôm qua', status: false },
    { id: 4, uri: 'https://randomuser.me/api/portraits/women/4.jpg', username: 'Phạm Thị D', date: '3 ngày trước', status: false },
  ];

  const Threads = [
    {
      threadid: 1,
      content: 'Nội dung bài viết',
      mediaFiles: [{ id: 1, imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg' }],
      likeCount: 124,
      commentCount: 67,
      retweetCount: 12,
      sendCount: 3,
      date: '2025-05-04',
      userid: 1,
      firstName: 'Nguyen',
      lastName: 'Dũng',
      avatar_path: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
    },
    {
      threadid: 2,
      content: 'Nội dung bài viết',
      mediaFiles: [{ id: 1, imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg' }],
      likeCount: 124,
      commentCount: 67,
      retweetCount: 12,
      sendCount: 3,
      date: '2025-05-04',
      userid: 1,
      firstName: 'Nguyen',
      lastName: 'Dũng',
      avatar_path: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
    },
  ];

  const mergedData = useMemo(() => {
    if (tabIndex === 'Tất cả') {
      return [
        ...users.map(user => ({ type: 'user', data: user })),
        ...Threads.map(thread => ({ type: 'thread', data: thread })),
      ];
    } else if (tabIndex === 'Lượt theo dõi') {
      return users.map(user => ({ type: 'user', data: user }));
    } else if (tabIndex === 'Bài đăng lại'){
      return Threads.map(thread =>({ type: 'thread', data: thread}))
    }
     else {
      return [];
    }
  }, [tabIndex]);

  return (
     <View className='flex-1 mt-[50px] bg-white px-5 '>
      <FlatList
        data={mergedData}
        keyExtractor={(item, index) => `${item.type}-${item.data.id || item.data.threadid || index}`}
        renderItem={({ item }) => {
          if (item.type === 'user') {
            return <FollowerActivity Users={item.data} handleFollow={() => {}} />;
          }
          if (item.type === 'thread') {
            return <Feed thread={item.data} />;
          }
          return null;
        }}
        ListHeaderComponent={
          <View>
            <Text className="text-3xl font-bold py-2 mb-4">Hoạt động</Text>

            {/* Tabs */}
            <FlatList
                    horizontal
                    data={Tabs}
                    contentContainerStyle={{gap: 10, padding: 4, flexDirection: 'row', alignItems: 'center'}}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                className={`py-2 px-6 rounded-full border border-gray-300 transition-colors ${
                                    tabIndex === item.name ? 'bg-gray-500' : 'bg-white'
                                }`}
                                onPress={() => setTabIndex(item.name)}
                            >
                                <Text className={`font-bold transition-colors ${tabIndex === item.name ? 'text-white' : 'text-black'}`}>{item.name}</Text>
                            </TouchableOpacity>
                    )} 
                />

            <Text className="text-xl font-bold mt-2 mb-2">Trước đó</Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View className="border-b-hairline border-b-gray-300 bg-gray-100" />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">Không có dữ liệu.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
    
  );
};

export default ActivityScreens;
