import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { getCommentsByThreadId } from '../services/commentService';
import useFetch from '../services/useFetch';

const Comments = () => {
  const route = useRoute();
  const { id } = route.params;
  const { data: comments, loading, error } = useFetch(() => getCommentsByThreadId(id), true);
  React.useEffect(() => {
    console.log('Comments:', comments);
  } , [id]);
  return (
    <View className='flex-1 bg-white'>
        
    </View>
  );
};

export default Comments;
