import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import useFetch from '../services/useFetch';
import CreateThreadsComponents from '../components/CreateThreadsComponents';
import Feed from '../components/Feed';
import { useAuth } from '../Auth/AuthContext';
import { getThreadById } from '../services/threadService';
import { getCommentById } from '../services/commentService';
import { getUserById } from '../services/userService';

const ReplyComment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { threadId, parentId } = route.params || {};
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("threadId:", threadId);
      console.log("parentId:", parentId);
      if (!threadId) {
        console.error('No threadId provided in ReplyComment');
        setError('Không có ID bài đăng. Vui lòng thử lại.');
        return;
      }

      try {
        let result = null;
        if (parentId) {
          // Nếu có parentId, lấy bình luận con để hiển thị
          result = await getCommentById(parentId);
          if (!result) {
            setError('Không tìm thấy bình luận.');
            return;
          }
        } else {
          // Nếu không có parentId, lấy bài viết gốc
          result = await getThreadById(threadId);
          if (!result) {
            // Nếu không tìm thấy thread, thử lấy comment (trường hợp threadId là comment)
            result = await getCommentById(threadId);
            if (!result) {
              setError('Không tìm thấy bài đăng hoặc bình luận.');
              return;
            }
          }
        }
        setThread({
          ...result,
          type: parentId ? 'comment' : 'thread',
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };
    fetchData();
  }, [threadId, parentId]);

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
    <View className="bg-white flex-1">
      {thread ? (
        <>
          <Feed thread={thread} />
          <View className="border-b-2 border-b-gray-300" />
        </>
      ) : (
        <ActivityIndicator size="large" className="mt-10" />
      )}
      <CreateThreadsComponents
        isPreview={false}
        user={userProfile}
        isReply={true}
        ThreadId={threadId}
        parentId={parentId}
      />
    </View>
  );
};

export default ReplyComment;