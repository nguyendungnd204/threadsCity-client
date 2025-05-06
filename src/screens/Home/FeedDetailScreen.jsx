import { useRoute, useNavigation } from '@react-navigation/native';
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

const FeedDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, parentId } = route.params || {};
  const [thread, setThread] = useState(null);
  const [parentThread, setParentThread] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);

  useEffect(() => {
    const fetchThread = async () => {
      if (!id) {
        console.error('No thread ID provided in FeedDetailScreen');
        setError('Không có ID bài đăng. Vui lòng thử lại.');
        return;
      }

      try {
        // Thử lấy bài đăng trước
        let result = await getThreadById(id);
        if (result) {
          if (!result.threadId && !result.threadid && !result.id) {
            console.error('Thread data missing threadId, threadid, or id:', result);
            setError('Dữ liệu bài đăng không hợp lệ.');
            return;
          }
          console.log('Fetched thread:', result);
          setThread({ ...result, type: 'thread' });
          setParentThread(null);
        } else {
          // Nếu không tìm thấy bài đăng, thử lấy bình luận
          const cmt = await getCommentById(id);
          if (!cmt) {
            console.error('Comment not found for ID:', id);
            setError('Không tìm thấy bài đăng hoặc bình luận.');
            return;
          }
          // if (!cmt.threadId && !cmt.threadid && !cmt.id) {
          //   console.error('Comment data missing threadId, threadid, or id:', cmt);
          //   setError('Dữ liệu bình luận không hợp lệ.');
          //   return;
          // }
          console.log('Fetched comment:', cmt);
          setThread({ ...cmt, type: 'comment' });

          // Lấy bài viết gốc hoặc bình luận cha
          if (cmt.threadId || cmt.threadid) {
            const parentThreadId = cmt.threadId || cmt.threadid;
            const parentResult = await getThreadById(parentThreadId);
            if (parentResult) {
              console.log('Fetched parent thread:', parentResult);
              setParentThread({ ...parentResult, type: 'thread' });
            } else {
              console.warn('Parent thread not found for threadId:', parentThreadId);
            }
          }
          if (cmt.parentId) {
            const parentComment = await getCommentById(cmt.parentId);
            if (parentComment) {
              console.log('Fetched parent comment:', parentComment);
              setParentThread({ ...parentComment, type: 'comment' });
            } else {
              console.warn('Parent comment not found for parentId:', cmt.parentId);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError('Lỗi khi tải bài đăng. Vui lòng thử lại sau.');
      }
    };
    fetchThread();
  }, [id, parentId]);

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
    if (parentThread) {
      items.push({ type: 'parent', data: parentThread });
    }
    if (thread) {
      items.push({ type: 'main', data: thread });
    }
    items.push({ type: 'comments' });
    return items;
  }, [thread, parentThread]);

  const renderItem = ({ item }) => {
    if (item.type === 'parent' || item.type === 'main') {
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
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-gray-500">Chưa có bình luận nào</Text>
            </View>
          }
          ListFooterComponent={
            <View className="bg-gray-200 my-0.5">
              <TouchableOpacity
                className="flex-row items-center rounded-full gap-2.5 p-2 m-1.5"
                onPress={() => {
                  if (!thread || (!thread.threadId && !thread.threadid && !thread.id)) {
                    console.error('Invalid thread data:', thread);
                    Alert.alert('Lỗi', 'Dữ liệu bài đăng không hợp lệ.');
                    return;
                  }
                  const threadId = thread.threadId || thread.threadid || thread.id;
                  const replyParentId = thread.type === 'comment' ? thread.id : null;
                  handlePress(threadId, replyParentId);
                }}
              >
                <Image
                  source={{
                    uri: userProfile?.avatar || 'https://via.placeholder.com/40',
                  }}
                  className="w-[40px] h-[40px] rounded-full"
                />
                <Text>Gửi đến {thread?.fullname || 'User'}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default FeedDetailScreen;