import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import Feed from '../../components/Feed';
import { ActivityIndicator } from 'react-native-paper';
import Comments from '../../components/Comments';
import useFetch from '../../services/useFetch';
import { useAuth } from '../../Auth/AuthContext';
import { getUserById } from '../../services/userService';
import { getThreadById } from '../../services/threadService';
import { getCommentById } from '../../services/commentService';
import { icons } from '../../constants/icons';

const FeedDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, parentId, refresh } = route.params || {};
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);
  const [rootThreadId, setRootThreadId] = useState(null); // Lưu ID của bài viết gốc
  const { user } = useAuth();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            console.log('Going back. Current stack:', navigation.getState().routes.map(r => r.name));
            navigation.goBack();
          }}
          style={{ marginLeft: 10 }}
        >
          <Image
            source={icons.back_arrow}
            style={{ width: 24, height: 24, tintColor: '#000', marginRight: 30 }}
          />
        </TouchableOpacity>
      ),
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const fetchThread = async () => {
    if (!id) {
      console.error('No thread ID provided in FeedDetailScreen');
      setError('Không có ID bài đăng. Vui lòng thử lại.');
      return;
    }

    try {
      let result = await getThreadById(id);
      let rootThreadId = id; // Giả định ban đầu id là threadId
      if (result) {
        // Trường hợp id là bài viết gốc
        if (!result.threadId && !result.threadid && !result.id) {
          console.error('Thread data missing threadId, threadid, or id:', result);
          setError('Dữ liệu bài đăng không hợp lệ.');
          return;
        }
        console.log('Fetched thread:', result);
        setThread({ ...result, type: 'thread' });
      } else {
        // Trường hợp id là bình luận
        const cmt = await getCommentById(id);
        if (!cmt) {
          console.error('Comment not found for ID:', id);
          setError('Không tìm thấy bài đăng hoặc bình luận.');
          return;
        }
        console.log('Fetched comment:', cmt);
        setThread({ ...cmt, type: 'comment' });

        // Xác định rootThreadId (ID của bài viết gốc) để sử dụng khi trả lời
        if (cmt.threadId || cmt.threadid) {
          rootThreadId = cmt.threadId || cmt.threadid;
        }
      }
      setRootThreadId(rootThreadId);
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError('Lỗi khi tải bài đăng. Vui lòng thử lại sau.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchThread();
    }, [id, refresh])
  );

  const handlePress = (threadId, parentId = null) => {
    if (!threadId) {
      console.error('threadId is missing');
      Alert.alert('Lỗi', 'Không tìm thấy ID bài đăng. Vui lòng thử lại.');
      return;
    }
    navigation.navigate('Reply', { threadId, parentId });
  };

  const data = useMemo(() => {
    const items = [];
    if (thread) {
      items.push({ type: 'main', data: thread });
    }
    items.push({ type: 'comments' });
    return items;
  }, [thread]);

  const renderItem = ({ item }) => {
    if (item.type === 'main') {
      return (
        <>
          <Feed thread={item.data} />
          <View className="border-b-2 border-b-gray-300" />
        </>
      );
    } else if (item.type === 'comments') {
      return <Comments />;
    }
    return null;
  };

  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 text-center">{error}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 bg-gray-300 p-2 rounded"
        >
          <Text>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {thread === null ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-4">
                <Text className="text-gray-500">Chưa có bình luận nào</Text>
              </View>
            }
          />
          <View
            className="absolute bottom-0 left-0 right-0 bg-gray-200 py-2 px-4"
            style={{ borderTopWidth: 1, borderTopColor: '#ccc' }}
          >
            <TouchableOpacity
              className="flex-row items-center rounded-full gap-2.5 p-2"
              onPress={() => {
                if (!thread || (!thread.threadid && !thread.id)) {
                  console.error('Invalid thread data:', thread);
                  Alert.alert('Lỗi', 'Dữ liệu bài đăng không hợp lệ.');
                  return;
                }
                if (!rootThreadId) {
                  console.error('Root thread ID is missing');
                  Alert.alert('Lỗi', 'Không tìm thấy ID bài đăng gốc.');
                  return;
                }
                const threadId = rootThreadId; // Luôn lấy ID của bài viết gốc
                const replyParentId = thread.type === 'comment' ? thread.id : null; // ID của bình luận con hoặc null
                console.log("ThreadId (root):", threadId);
                console.log("ParentId:", replyParentId);
                handlePress(threadId, replyParentId);
              }}
            >
              <Image
                source={{
                  uri: userProfile?.avatar,
                }}
                className="w-[40px] h-[40px] rounded-full"
              />
              <Text>Gửi đến {thread?.fullname || 'User'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default FeedDetailScreen;