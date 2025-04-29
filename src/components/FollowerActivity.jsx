import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useAuth } from '../Auth/AuthContext';
import { isFollowing, unfollowUser, followUser } from '../services/followService';

const FollowerActivity = ({ Users }) => {
    const { user } = useAuth();
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    

    useEffect(() => {
            const checkFollowing = async () => {
              if (user?.oauthId && Users.userId && user.oauthId !== Users.userId) {
                const following = await isFollowing(user.oauthId, Users.userId);
                setIsFollowingUser(following);
              }
            };
            checkFollowing();
        }, [user, Users.userId]);
        
        useEffect(() => {
              if (Users?.followers) {
                setFollowerCount(Object.keys(Users.followers).length);
              }
        }, [Users]);
    
        const handleFollow = async () => {
            if (!user?.oauthId || user.oauthId === Users.userId) return;
        
            try {
              if (isFollowingUser) {
                await unfollowUser(user.oauthId, Users.userId);
                setIsFollowingUser(false);
                setFollowerCount((prev) => prev - 1);
              } else {
                await followUser(user.oauthId, Users.userId);
                setIsFollowingUser(true);
                setFollowerCount((prev) => prev + 1);
              }
            } catch (error) {
              console.error("Error handling follow:", error);
            }
        };

    return(
        <View className='flex-row items-center px-2 py-4 gap-1'>
            <Image source={{ uri: Users?.avatar }} className='w-14 h-14 rounded-full'/> 
            <View className='flex-1 gap-1 ml-4' >
                <View className='flex-row items-center gap-1'> 
                    <Text className='text-sm font-bold' numberOfLines={1} style={{ flexShrink: 1 }}>{Users?.fullname}</Text>
                    <Text className='text-xs text-gray-500' >10 giờ</Text>
                </View>
                <Text className='text-sm text-gray-500'>Đã theo dõi bạn</Text>
            </View>
        
            <TouchableOpacity
                className='py-2 px-6 rounded-xl border border-gray-300 items-center'
                onPress={handleFollow}
            >
                <Text className={`font-bold ${!isFollowingUser ? 'text-black' : 'text-gray-400'}`}>{isFollowingUser ? 'Đang theo dõi' : 'Theo dõi lại'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FollowerActivity