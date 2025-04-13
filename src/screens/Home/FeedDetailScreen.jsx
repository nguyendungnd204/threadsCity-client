import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { getThreadById } from '../../services/threadService';
import React from 'react';
import Feed from '../../components/Feed';
import { ActivityIndicator } from 'react-native-paper';
import Comments from '../../components/Comments';

const FeedDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  const [thread, setThread] = React.useState(null); // dùng null để phân biệt đang loading

  React.useEffect(() => {
    const fetchThread = async () => {
      const result = await getThreadById(id);
      setThread(result); // nếu không có cũng là null
    };

    fetchThread();
  }, [id]);

  return (
    <View className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {thread ? (
          <>
            <Feed thread={thread} />
            <Comments threadId={thread.threadid} />
          </>
        ) : (
          <ActivityIndicator size="large" className='mt-10' />
        )}
      </ScrollView>
    </View>
  );
};

export default FeedDetailScreen;
