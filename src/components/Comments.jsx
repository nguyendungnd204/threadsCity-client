import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { getCommentsByThreadId } from '../services/commentService';
import useFetch from '../services/useFetch';
import Feed from './Feed';

const Comments = () => {
  const route = useRoute();
  const { id } = route.params;
  const [comments, setComments] = React.useState([])

  React.useEffect(() => {
      
      const fetchComment = async () => {
        const result = await getCommentsByThreadId(id)
        console.log('Comments:', result);  
        setComments(result);
      }
      fetchComment();
  }, [id]);

  return (
    <View>
        {comments?.map((cmt) => (
          <Feed key={cmt.id} thread={cmt}/>
        ))}
    </View>
  );
};

export default Comments;
