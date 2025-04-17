import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const formatNumber = (num) => {
    if (num >= 1_000_000_000) return (num /1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const ProfileSearchResult = ({ Users, handleFollow }) => {
    const navigation = useNavigation();
    
    React.useEffect(() => {
        console.log(Users.id)
    })
    
    const handleGoProfile = (id) => {
        navigation.navigate("UserProfile", { id })
    }

    return(
        <TouchableOpacity className='flex-row items-center px-3 py-4 gap-1' onPress={() => handleGoProfile(Users.id)}>
            <Image source={{ uri: Users.avatar }} className='w-14 h-14 rounded-full'/> 
            <View className='flex-1 gap-1 ml-4' >
                <Text className='text-base font-bold'>{Users.fullname}</Text>
                <Text className='text-base text-gray-500' numberOfLines={1} style={{ flexShrink: 1 }} >{Users.email}</Text>
                <Text className='text-base text-gray-500'>{formatNumber(Users.followCount)} followers</Text>
            </View>
        
            <TouchableOpacity className='py-2 px-6 rounded-lg border border-gray-300' onPress={handleFollow}>
            {Users.status === true ? (
                <Text className='font-bold text-gray-400'>Đang theo dõi</Text>
            ) : (
                <Text className='font-bold'>Theo dõi lại</Text>
            )}
            </TouchableOpacity>
        </TouchableOpacity>
    )
}


// ProfileSearchResult.PropTypes = {
//     Users: PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         uri: PropTypes.string.isRequired,
//         username: PropTypes.string.isRequired,
//         firstName: PropTypes.string.isRequired,
//         lastName: PropTypes.string.isRequired,
//         followCount: PropTypes.number.isRequired,
//         status: PropTypes.bool.isRequired,
//     }).isRequired,
// };

export default ProfileSearchResult