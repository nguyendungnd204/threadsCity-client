import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { icons } from '../constants/icons';
// interface User {
//     id: number;
//     username: string;
//     firstName: string;
//     lastName: string;
//     avatar_path: string | null;
// }

// interface Threads {
//     threadid: number,
//     content: string,
//     mediaFiles?:{ 
//         id: number,
//         imageUrl: string,
//     }[], 
//     likeCount: number, 
//     commentCount: number, 
//     retweetCount: number,
//     sendCount: number,
//     // creator: User,
//     date: string,
//     userid: number,
//     firstName: string,
//     lastName: string,
//     avatar_path: string,
// }

const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};
const Feed = ( {thread} ) => {
    const [like, setLike] = useState(false);
    
    return(
        <View className='flex-row items-center px-3 py-4 gap-1'>
            <Image source={{ uri: thread.avatar_path }} className='w-14 h-14 rounded-full self-start'/> 
        <View className='flex-1 gap-1 ml-4' >
            <View className='flex-row items-center'>
                <View className='flex-row items-center flex-1 gap-1'>
                    <Text className='text-base font-bold' numberOfLines={1} style={{ flexShrink: 1 }}>{thread.firstName} {thread.lastName}</Text>
                    <Text className='text-sm text-gray-500' >{thread.date}</Text>    
                </View>
                <Image source={icons.more} className='size-6 self-end' tintColor="gray"/>
            </View>
               {/* <Text className='text-sm text-gray-500'>Được chọn cho bạn</Text> */}
               <Text className='text-base mb-3'>{thread.content}</Text>

               {thread.mediaFiles && thread.mediaFiles.length > 0 && (
                    <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', gap: 14, paddingRight: 40,}}
                    >
                        {thread.mediaFiles.map((media) => (
                            <Link href={'/'} key={media.id} asChild>
                                <TouchableOpacity>
                                   <Image source={{ uri: media.imageUrl}} className='h-60 w-60 rounded-xl mb-3'/>
                                </TouchableOpacity>
                            </Link>
                        )) }
                    </ScrollView>
               )}       
            
            <View className='flex-row mt-3 gap-4'>
                <TouchableOpacity className="flex-row items-center" onPress={() =>  setLike(!like)}>
                        {like ? (
                            <>
                                <Image source={icons.islike} className='size-6' />
                                <Text className='text-base font-normal ml-1' >{formatNumber(thread.likeCount + 1)}</Text>
                            </>
                        ): (
                            <>
                                <Image source={icons.unlike} className='size-6' />
                                <Text className='text-base font-normal ml-1' >{formatNumber(thread.likeCount)}</Text>
                            </>
                        )}
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                        <Image source={icons.chat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(thread.commentCount)}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                        <Image source={icons.repeat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(thread.retweetCount)}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                        <Image source={icons.send} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(thread.sendCount)}</Text>
                </TouchableOpacity>
            </View>
        </View>

        
    </View>
    )
}

Feed.PropTypes = {
    thread: PropTypes.shape({
      threadid: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      mediaFiles: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          imageUrl: PropTypes.string.isRequired,
        })
      ),
      likeCount: PropTypes.number.isRequired,
      commentCount: PropTypes.number.isRequired,
      retweetCount: PropTypes.number.isRequired,
      sendCount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      userid: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar_path: PropTypes.string.isRequired,
    }).isRequired,
  };
  
export default Feed;