import { useRoute } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import React from 'react';

const Comments = () => {
  const route = useRoute();
  const { id } = route.params;
    // const [comments, setComments] = React.useState([]); // dùng null để phân biệt đang loading
    // const [loading, setLoading] = React.useState(true); // dùng null để phân biệt đang loading
    


  return (
    <View className='flex-1 bg-white'>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Text className='text-center text-2xl font-bold mt-10'>Bình luận {id}</Text>
            
        </ScrollView>
    </View>
  );
};

export default Comments;
