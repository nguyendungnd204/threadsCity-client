import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { icons } from '../constants/icons';
import CustomVideoPlayer from './CustomVideoPlayer';
import { useNavigation } from '@react-navigation/native';

const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};
const formatDate = (date) => {
    const today = new Date();
    const givenDate = new Date(date);
    const diffTime = Math.abs(today - givenDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi thành số ngày

    if (diffDays === 0) {
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes} phút trước`;
        }
        return `${diffHours} giờ trước`;
    }
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays <= 7) return `${diffDays} ngày trước`;
    return givenDate.toLocaleDateString('vi-VN'); // Hiển thị ngày tháng đầy đủ
};

const Feed = ( {thread} ) => {
    const [like, setLike] = useState(false);
    const navigation = useNavigation();
    
    const handleGoProfile = (id) => {
        navigation.navigate("UserProfile", { id })
    }

    const handleReply = (id) => {
        navigation.navigate('FeedDetail', { id });
    };

    return(
        <View className='flex-row items-center px-3 py-4 gap-1'>
            <TouchableOpacity onPress={() => handleGoProfile(thread.authorId)} className='self-start'>
                <Image source={{ uri: thread.avatar_path }} className='w-14 h-14 rounded-full'/> 
            </TouchableOpacity>
        <View className='flex-1 gap-1 ml-4' >
            <View className='flex-row items-center'>
                <View className='flex-row items-center flex-1 gap-1.5'>
                    <TouchableOpacity onPress={() => handleGoProfile(thread.authorId)}>
                        <Text className='text-base font-bold' numberOfLines={1} style={{ flexShrink: 1 }}>{thread.fullname}</Text>
                    </TouchableOpacity>
                    <Text className='text-sm text-gray-500' >{formatDate(thread.createdAt)}</Text>    
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
                            media.imageUrl ? (
                            <Link href={'/'} key={media.id} asChild>
                                <TouchableOpacity>
                                   <Image source={{ uri: media.imageUrl}} className='h-60 w-60 rounded-xl mb-3'/>
                                </TouchableOpacity>
                            </Link>
                            ) :  media.videoUrl ? (
                                <Link href={'/'} key={media.id} asChild>
                                    <TouchableOpacity>
                                        
                                        <CustomVideoPlayer uri={media.videoUrl}/>
                                    </TouchableOpacity>
                                </Link>
                            ) : null
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
                <TouchableOpacity className="flex-row items-center" onPress={() => handleReply(thread.threadid)}>
                        <Image source={icons.chat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(thread.commentCount)}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                        <Image source={icons.repeat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(thread.retweetCount)}</Text>
                </TouchableOpacity>
            </View>
        </View>

        
    </View>
    )
}

// Feed.PropTypes = {
//     thread: PropTypes.shape({
//       threadid: PropTypes.number.isRequired,
//       content: PropTypes.string.isRequired,
//       mediaFiles: PropTypes.arrayOf(
//         PropTypes.shape({
//           id: PropTypes.number.isRequired,
//           imageUrl: PropTypes.string.isRequired,
//         })
//       ),
//       likeCount: PropTypes.number.isRequired,
//       commentCount: PropTypes.number.isRequired,
//       retweetCount: PropTypes.number.isRequired,
//       sendCount: PropTypes.number.isRequired,
//       date: PropTypes.string.isRequired,
//       userid: PropTypes.number.isRequired,
//       firstName: PropTypes.string.isRequired,
//       lastName: PropTypes.string.isRequired,
//       avatar_path: PropTypes.string.isRequired,
//     }).isRequired,
//   };
  
export default Feed;