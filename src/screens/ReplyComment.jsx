import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import useFetch from '../services/useFetch';
import CreateThreadsComponents from '../components/CreateThreadsComponents';
import Feed from '../components/Feed';
import { useAuth } from '../Auth/AuthContext';
import { getCommentById } from '../services/commentService';
import { getThreadById} from '../services/threadService';
import { getUserById } from '../services/userService';

const ReplyComment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { threadId, parentId } = route.params || {};
  const [thread, setThread] = useState(null);
  const [parentComment, setParentComment] = useState(null);
  const { user } = useAuth();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);

  useEffect(() => {
    const fetchData = async () => {
      if (!threadId) {
        console.error('No threadId provided in ReplyComment');
        return;
      }

      const threadResult = await getThreadById(threadId);
      if (threadResult){
        setThread(threadResult);
      } else {
        const cmtResult = await getCommentById(threadId);
        setThread(cmtResult)
      }
      

      if (parentId) {
        const commentResult = await getCommentById(parentId);
        setParentComment(commentResult);
      }
    };
    fetchData();
  }, [threadId, parentId]);

  return (
    <View className="bg-white flex-1">
      {thread ? (
        <>
          <Feed thread={thread} />
          {parentComment && (
            <>
              <View style={{ marginLeft: 20, borderLeftWidth: 2, borderLeftColor: '#ccc', paddingLeft: 10 }}>
                <Feed thread={parentComment} />
              </View>
              <View className="border-b-2 border-b-gray-300" />
            </>
          )}
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