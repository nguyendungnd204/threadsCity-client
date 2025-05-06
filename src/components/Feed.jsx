import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { icons } from '../constants/icons';
import CustomVideoPlayer from './CustomVideoPlayer';
import { useAuth } from '../Auth/AuthContext';
import { toggleLikeThread } from '../services/likeService';
import UserImageIcon from './UserImageIcon';
import { database } from '../../FirebaseConfig';
import { showAlert } from './Alert';
import { getUserById } from '../services/userService';
import { ref, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import { debounce } from 'lodash';
import { toggleRepostThread } from '../services/threadService';
import ThreadMenu from './ThreadMenu';

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
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} phút trước`;
    }
    return `${diffHours} giờ trước`;
  }
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays <= 7) return `${diffDays} ngày trước`;
  return givenDate.toLocaleDateString('vi-VN');
};

const Feed = ({ thread, onReply }) => {
  const [liked, setLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countLiked, setCountLiked] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);

  const userId = thread.authorId;
  const [userProfile, setUserProfile] = useState(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!thread || (!thread.threadid && !thread.id)) {
    console.error('Invalid thread prop:', thread);
    return (
      <View className="flex-row items-center px-3 py-4 gap-1">
        <Text className="text-red-500">Lỗi: Dữ liệu bài đăng không hợp lệ</Text>
      </View>
    );
  }

  const threadId = thread.threadid || thread.id;

  useEffect(() => {
    if (user?.oauthId && threadId) {
      const likeRef = ref(database, `threads/${threadId}/likes`);
      const likeQuery = query(likeRef, orderByChild('userId'), equalTo(user.oauthId));
      const unsubscribe = onValue(likeQuery, (snapshot) => {
        setLiked(snapshot.exists());
      });
      return () => off(likeRef, 'value', unsubscribe);
    } else {
      setLiked(false);
    }
  }, [user?.oauthId, threadId]);
  useEffect(() => {
    if (user?.oauthId && threadId) {
      const repostsRef = ref(database, `threads/${threadId}/reposts`);
      const repostQuery = query(repostsRef, orderByChild('userId'), equalTo(user.oauthId));
  
      const unsubscribe = onValue(repostQuery, (snapshot) => {
        setIsReposted(snapshot.exists());
      });
  
      return () => unsubscribe(); 
    } else {
      setIsReposted(false);
    }
  }, [user?.oauthId, threadId]);
  
  useEffect(() => {
    if (!threadId) return;

    const likesRef = ref(database, `threads/${threadId}/likes`);
    const commentsRef = ref(database, `threads/${threadId}/comments`);
    const repostsRef = ref(database, `threads/${threadId}/reposts`);

    const unsubscribeLikes = onValue(likesRef, (snapshot) => {
      const likes = snapshot.val();
      setCountLiked(likes ? Object.keys(likes).length : 0);
    });

    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
      const comments = snapshot.val();
      setCommentCount(comments ? Object.keys(comments).length : 0);
    });

    const unsubscribeRepostCount = onValue(repostsRef, (snapshot) => {
      const reposts = snapshot.val();
      setRepostCount(reposts ? Object.keys(reposts).length : 0);
    });

    return () => {
      off(likesRef, 'value', unsubscribeLikes);
      off(commentsRef, 'value', unsubscribeComments);
      off(repostsRef, 'value', unsubscribeRepostCount);
    };
  }, [threadId, user?.oauthId]);

  const handleLike = debounce(async () => {
    const userData = {
      userId: user.oauthId,
      username: user.fullname,
      avatar: user.avatar,
      email: user.email,
      authorName: thread.fullname,
    };
    console.log('Calling toggleLikeThread with:', {
      userId: user.oauthId,
      threadId: threadId,
      userData,
    });

    setIsLoading(true);
    const previousLiked = liked;
    const previousLikeCount = countLiked;
    setLiked(!liked);
    setCountLiked(liked ? countLiked - 1 : countLiked + 1);
    try {
      const response = await toggleLikeThread(user.oauthId, threadId, userData);
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

  const handleRepostThread = debounce(async () => {
    if (!user?.oauthId || !threadId) {
      showAlert('error', 'Không thể đăng lại: Thiếu thông tin người dùng hoặc bài đăng.');
      return;
    }
  
    setIsLoading(true);
    const previousReposted = isReposted;
    const previousRepostCount = repostCount;
  
    setIsReposted(!isReposted);
    setRepostCount(isReposted ? repostCount - 1 : repostCount + 1);
    showAlert("success", "Đã đăng lại")
  
    try {
      const response = await toggleRepostThread(threadId, user.oauthId);
      console.log('toggleRepostThread response:', response);
  
      if (response.success) {
        showAlert('success', isReposted ? 'Đã hủy đăng lại' : 'Đã đăng lại');
      } else {
        setIsReposted(previousReposted);
        setRepostCount(previousRepostCount);
        showAlert('error', response.message || 'Không thể đăng lại bài đăng.');
      }
    } catch (error) {
      setIsReposted(previousReposted);
      setRepostCount(previousRepostCount);
      showAlert('error', 'Lỗi khi đăng lại: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, 300);
  const handleGoProfile = (id) => {
    if (!id) {
      console.error('Cannot navigate to UserProfile: authorId is missing');
      return;
    }
    if (user?.oauthId !== id) {
      navigation.navigate('UserProfile', { id });
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleComment = () => {
    console.log('Navigating to FeedDetail with id:', threadId);
    navigation.navigate('FeedDetail', { id: threadId });
  };

  const userId = thread.authorId;
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        const userData = await getUserById(userId);
        setUserProfile(userData);
      }
    };
    fetchUserProfile();
  }, [userId]);


  return (
    <View className="flex-row items-center px-3 py-4 gap-1">
      <TouchableOpacity
        onPress={() => handleGoProfile(thread.authorId)}
        className="self-start"
      >
        <UserImageIcon
          source={
            userProfile?.avatar
              ? { uri: userProfile.avatar }
              : require('../assets/images/threads-logo-black.png')
          }
        />
      </TouchableOpacity>
      <View className="flex-1 gap-1 ml-4">
        <View className="flex-row items-center">
          <View className="flex-row items-center flex-1 gap-1.5">
            <TouchableOpacity onPress={() => handleGoProfile(thread.authorId)}>
              <Text
                className="text-base font-bold"
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              >
                {thread.fullname}
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-500">{formatDate(thread.createdAt)}</Text>
          </View>
          <ThreadMenu />
        </View>
        <Text className="text-base mb-3">{thread.content}</Text>

        {thread.mediaFiles && Object.values(thread.mediaFiles).length > 0 && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', gap: 14, paddingRight: 40 }}
            data={Object.values(thread.mediaFiles).filter(
              (media) => media && (media.imageUrl || media.videoUrl)
            )}
            keyExtractor={(media, index) => media.id || `${threadId}-media-${index}`}
            renderItem={({ item: media }) =>
              media.imageUrl ? (
                <Link href={'/'} asChild>
                  <TouchableOpacity>
                    <Image
                      source={{ uri: media.imageUrl }}
                      className="h-[240px] w-[240px] rounded-xl overflow-hidden mb-3"
                    />
                  </TouchableOpacity>
                </Link>
              ) : media.videoUrl ? (
                  <TouchableOpacity onPress={() => handleGoMediaFile(threadId)}>
                    <CustomVideoPlayer uri={media.videoUrl} />
                  </TouchableOpacity>
              ) : null
            }
          />
        )}

        <View className="flex-row mt-3 gap-4">
          <TouchableOpacity className="flex-row items-center" onPress={handleLike}>
            <Image
              source={liked ? icons.islike : icons.unlike}
              className="size-6 mr-2"
            />
            {countLiked > 0 ? (
              <Text className="text-base font-normal">{formatNumber(countLiked)}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center" onPress={handleComment}>
            <Image source={icons.chat} className="size-6 mr-2" />
            {commentCount > 0 ? (
              <Text className="text-base font-normal">{formatNumber(commentCount)}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center" onPress={handleRepostThread}>
            <Image
              source={isReposted ? icons.reposted : icons.repeat}
              className="size-6 mr-2"
            />
            {repostCount > 0 ? (
              <Text className="text-base font-normal">{formatNumber(repostCount)}</Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Feed.propTypes = {
  thread: PropTypes.shape({
    threadid: PropTypes.string,
    id: PropTypes.string,
    content: PropTypes.string.isRequired,
    mediaFiles: PropTypes.object,
    fullname: PropTypes.string.isRequired,
    avatar_path: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onReply: PropTypes.func,
};

export default Feed;