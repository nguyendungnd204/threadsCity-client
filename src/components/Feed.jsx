import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { icons } from '../constants/icons';
import CustomVideoPlayer from './CustomVideoPlayer';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Auth/AuthContext';
import { toggleLikeThread } from '../services/likeService';
import UserImageIcon from './UserImageIcon';
import { database } from '../../FirebaseConfig';
import { 
    ref, push, set, get, query, 
    orderByChild, equalTo, update, 
    remove, onValue, off,
    limitToLast, startAt, endAt, increment
} from 'firebase/database';
import { debounce } from 'lodash';

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
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countLiked, setCountLiked] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [repostCount, setRepostCount] = useState(0);
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.oauthId && thread.threadid) {
          const likeRef = ref(database, `threads/${thread.threadid}/likes`);
          const likeQuery = query(likeRef, orderByChild('userId'), equalTo(user.oauthId));
          const unsubscribe = onValue(likeQuery, (snapshot) => {
            setLiked(snapshot.exists());
          });
          return () => off(likeRef, 'value', unsubscribe);
        } else {
          setLiked(false);
        }
      }, [user?.oauthId, thread.threadid]);
    
      useEffect(() => {
        if (!thread.threadid) return;
    
        const likesRef = ref(database, `threads/${thread.threadid}/likes`);
        const commentsRef = ref(database, `threads/${thread.threadid}/comments`);
        const repostsRef = ref(database, `threads/${thread.threadid}/reposts`);
    
        const unsubscribeLikes = onValue(likesRef, (snapshot) => {
          const likes = snapshot.val();
          setCountLiked(likes ? Object.keys(likes).length : 0);
        });
    
        const unsubscribeComments = onValue(commentsRef, (snapshot) => {
          const comments = snapshot.val();
          setCommentCount(comments ? Object.keys(comments).length : 0);
        });
    
        const unsubscribeReposts = onValue(repostsRef, (snapshot) => {
          const reposts = snapshot.val();
          setRepostCount(reposts ? Object.keys(reposts).length : 0);
        });
    
        return () => {
          off(likesRef, 'value', unsubscribeLikes);
          off(commentsRef, 'value', unsubscribeComments);
          off(repostsRef, 'value', unsubscribeReposts);
        };
      }, [thread.threadid]);

    const handleLike = debounce(async () => {
        const userData = {
          userId: user.oauthId ,
          username: user.fullname,
          avatar: user.avatar,
          email : user.email,
        };
        console.log('Gọi toggleLikeThread với:', {
          userId: user.oauthId,
          threadId: thread.threadid,
          userData,
        });
    
        setIsLoading(true);
        const previousLiked = liked;
        const previousLikeCount = countLiked;
        setLiked(!liked);
        setCountLiked(liked ? countLiked - 1 : countLiked + 1);
    
        try {
          const response = await toggleLikeThread(user.oauthId , thread.threadid, userData);
          if (!response.success) {
            setLiked(previousLiked);
            setCountLiked(previousLikeCount);
          }
        } catch (error) {
          setLiked(previousLiked);
          setCountLiked(previousLikeCount);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    
    const handleGoProfile = (id) => {
      if (user?.oauthId !== id) {
        navigation.navigate("UserProfile", { id })
      } else {
        navigation.navigate("Profile")
      }
    }

    React.useEffect(() => {
      console.log(thread.threadid)
    }, [thread])
    const handleReply = (id) => {
        navigation.navigate('FeedDetail', { id });
    };

    return(
        <View className='flex-row items-center px-3 py-4 gap-1'>
            <TouchableOpacity onPress={() => handleGoProfile(thread.authorId)} className='self-start'>
                <UserImageIcon source={{ uri: thread.avatar_path }} />
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
                        {Object.values(thread.mediaFiles)
                            .filter((media) => media && (media.imageUrl || media.videoUrl)) // Lọc các media hợp lệ
                            .map((media, index) => {
                                const key = media.id || `${thread.threadid}-media-${index}`; // Fallback key nếu media.id không tồn tại
                                return media.imageUrl ? (
                                <Link href={'/'} key={key} asChild>
                                    <TouchableOpacity>
                                    <Image source={{ uri: media.imageUrl }} className='h-[240px] w-[240px] rounded-xl overflow-hidden mb-3' />
                                    </TouchableOpacity>
                                </Link>
                                ) : media.videoUrl ? (
                                <Link href={'/'} key={key} asChild>
                                    <TouchableOpacity>
                                    <CustomVideoPlayer uri={media.videoUrl} />
                                    </TouchableOpacity>
                                </Link>
                                ) : null;
                            })}
                    </ScrollView>
               )}       
            
            <View className='flex-row mt-3 gap-4'>
                <TouchableOpacity className="flex-row items-center" onPress={handleLike}>                        
                    <Image source={liked ? icons.islike : icons.unlike} className='size-6' />
                    <Text className='text-base font-normal ml-1' >{formatNumber(countLiked)}</Text> 
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center" onPress={() => handleReply(thread.threadid)}>
                        <Image source={icons.chat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(commentCount)}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                        <Image source={icons.repeat} className='size-6' />
                        <Text className='text-base font-normal ml-1' >{formatNumber(repostCount)}</Text>
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