import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import useFetch from '../services/useFetch';
import CreateThreadsComponents from '../components/CreateThreadsComponents';
import Feed from '../components/Feed';
import { useAuth } from '../Auth/AuthContext';
import { getThreadById } from '../services/threadService';
import { getUserById } from '../services/userService';

const ReplyComment = () => {

    const route = useRoute();
    const { threadId } = route.params;
    const [thread, setThread] = React.useState(null); // dùng null để phân biệt đang loading
    const { user } = useAuth();
    const {data: userProfile} = useFetch(() => getUserById(user?.oauthId), true);
  
    React.useEffect(() => {
        if (user && user.oauthId) {
          console.log('User ID:', user.oauthId);
          console.log('User Profile:', threadId);
        }
    }, [userProfile]);
    
    React.useEffect(() => {
      const fetchThread = async () => {
        const result = await getThreadById(threadId);
        setThread(result); // nếu không có cũng là null
      };
      console.log("A", threadId)
      fetchThread();
    }, [threadId]);
  
    return (
      <View className='bg-white'>
          {thread ? (
              <Feed thread={thread} />
          ) : (
            <ActivityIndicator size="large" className='mt-10' />
          )}
        <CreateThreadsComponents isPreview={false} user={userProfile} isReply={true} ThreadId={threadId} parentId={null}/>
        
      </View>
    );
  };
export default ReplyComment;
