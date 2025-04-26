import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { isFollowing, unfollowUser, followUser } from '../services/followService';
import { useAuth } from '../Auth/AuthContext';
import useFetch from '../services/useFetch';
import { getUserById } from '../services/userService';
import { ActivityIndicator } from 'react-native';
import { icons } from '../constants/icons';

const formatNumber = (num) => {
    if (num >= 1_000_000_000) return (num /1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const ProfileSearchResult = ({ userId }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { data: userProfile, loading: userLoading, refetch: refecthThead } = useFetch(() => getUserById(userId), true);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        console.log(userId)
    }, [userId]);
    
    useEffect(() => {
        const checkFollowing = async () => {
          if (user?.oauthId && userId && user.oauthId !== userId) {
            const following = await isFollowing(user.oauthId, userId);
            setIsFollowingUser(following);
          }
        };
        checkFollowing();
    }, [user, userId]);
    
    useEffect(() => {
          if (userProfile?.followers) {
            setFollowerCount(Object.keys(userProfile.followers).length);
          }
    }, [userProfile]);

    const handleFollow = async () => {
        if (!user?.oauthId || user.oauthId === userId) return;
    
        try {
          if (isFollowingUser) {
            await unfollowUser(user.oauthId, userId);
            setIsFollowingUser(false);
            setFollowerCount((prev) => prev - 1);
          } else {
            await followUser(user.oauthId, userId);
            setIsFollowingUser(true);
            setFollowerCount((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Error handling follow:", error);
        }
    };
    
    if (userLoading) return <ActivityIndicator size="small" color="#0000ff" />;
    
    const handleGoProfile = (id) => {
        navigation.navigate("UserProfile", { id })
    }

    return(
        <TouchableOpacity className='flex-row items-center px-3 py-4 gap-1' onPress={() => handleGoProfile(userId)}>
            <Image source={userProfile?.avatar ? { uri: userProfile.avatar } : icons.user} className='w-14 h-14 rounded-full'/> 
            <View className='flex-1 gap-1 ml-4' >
                <Text className='text-base font-bold'>{userProfile?.fullname}</Text>
                <Text className='text-base text-gray-500' numberOfLines={1} style={{ flexShrink: 1 }} >{userProfile?.email}</Text>
                <Text className='text-base text-gray-500'>{formatNumber(followerCount)} followers</Text>
            </View>
        
            {user?.oauthId !== userId ? (
                <TouchableOpacity
                className={`py-2 px-6 rounded-xl border border-gray-300 items-center ${isFollowingUser ? 'bg-gray-100' : ''}`}
                onPress={handleFollow}
                >
                    <Text>{isFollowingUser ? 'Đã theo dõi' : 'Theo dõi'}</Text>
                </TouchableOpacity>
            ) : null}
        </TouchableOpacity>
    )
}

export default ProfileSearchResult