import { View, Text, Image, TouchableOpacity, FlatList} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed';

const HomScreen = () => {
  const TabSelect = ["Dành cho bạn", "Đang theo dõi"];
  const [tab, setTab] = React.useState("Dành cho bạn");
  
  const Threads = [
    {
        threadid: 1,
        content: "Nội dung bài viết",
        mediaFiles: [
            {
                id: 1,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 2,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 3,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
        ], 
        likeCount: 124, 
        commentCount: 67, 
        retweetCount: 12,
        sendCount: 3,
        // creator: User,
        date: '2025-05-04',
        userid: 1,
        firstName: "Nguyen",
        lastName: "Dũng",
        avatar_path: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
    },
    {
        threadid: 2,
        content: "Nội dung bài viết",
        mediaFiles: [
            {
                id: 1,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 2,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 3,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
        ], 
        likeCount: 124, 
        commentCount: 67, 
        retweetCount: 12,
        sendCount: 3,
        // creator: User,
        date: '2025-05-04',
        userid: 1,
        firstName: "Nguyen",
        lastName: "Dũng",
        avatar_path: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
    },
    {
        threadid: 3,
        content: "Nội dung bài viết",
        mediaFiles: [
            {
                id: 1,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 2,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
            {
                id: 3,
                imageUrl: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
            },
        ], 
        likeCount: 124, 
        commentCount: 67, 
        retweetCount: 12,
        sendCount: 3,
        // creator: User,
        date: '2025-05-04',
        userid: 1,
        firstName: "Nguyen",
        lastName: "Dũng",
        avatar_path: 'https://static01.nyt.com/images/2022/09/16/arts/16CAMERON1/16CAMERON1-mediumSquareAt3X.jpg',
    },
]
  return (
    <SafeAreaView className='flex-1'>
        <FlatList
                showsVerticalScrollIndicator={false}
                data={Threads}
                keyExtractor={(item) => item.threadid.toString()}
                renderItem={({ item }) => <Feed thread={item} />}
                ListHeaderComponent={
                    <View className='pb-4'>
                      <Image source={require("./../assets/images/threads-logo-black.png")} className='w-20 h-20 self-center'/>
                      <View className='flex-row flex-1 justify-around py-2'>
                        {TabSelect.map((item) => (
                            <TouchableOpacity
                                key={item}
                                className='items-center'
                                onPress={() => setTab(item)}
                            >
                                <Text className={`text-base font-bold ${tab === item ? 'text-black' : 'text-gray-300'}`}>
                                    {item}
                                </Text>
                                <View className={`mt-1 h-[2] w-[210] rounded-full ${ tab === item ? 'bg-black' : 'bg-gray-300'}`} />
                            </TouchableOpacity>
                        ))}
                      </View>
                      {/* {tab === "Dành cho bạn" && <ThreadComposer />} */}
                    </View>
                  }
                ItemSeparatorComponent={() => (
                    <View className='border-b-hairline border-b-gray-400 bg-gray-100' />
                )} 
                className='flex-1 bg-white'
        />
    </SafeAreaView>
    
  )
}

export default HomScreen