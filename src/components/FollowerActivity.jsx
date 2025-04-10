import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

const FollowerActivity = ({ Users, handleFollow }) => {

    return(
        <View className='flex-row items-center px-2 py-4 gap-1'>
            <Image source={{ uri: Users.uri }} className='w-14 h-14 rounded-full'/> 
            <View className='flex-1 gap-1 ml-4' >
                <View className='flex-row items-center gap-1'> 
                    <Text className='text-sm font-bold' numberOfLines={1} style={{ flexShrink: 1 }}>{Users.username}</Text>
                    <Text className='text-xs text-gray-500' >{Users.date}</Text>
                </View>
                <Text className='text-sm text-gray-500'>Đã theo dõi bạn</Text>
            </View>
        
            <TouchableOpacity className='py-2 px-6 rounded-lg border border-gray-300' onPress={handleFollow}>
            {Users.status === true ? (
                <Text className='font-bold text-gray-400'>Đang theo dõi</Text>
            ) : (
                <Text className='font-bold'>Theo dõi lại</Text>
            )}
            </TouchableOpacity>
        </View>
    )
}


FollowerActivity.PropTypes = {
    Users: PropTypes.shape({
        id: PropTypes.number.isRequired,
        uri: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        followCount: PropTypes.number.isRequired,
        status: PropTypes.bool.isRequired,
    }).isRequired,
};

export default FollowerActivity