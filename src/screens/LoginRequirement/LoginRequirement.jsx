import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const LoginRequirement = () => {
    const navigation = useNavigation();
    return (
        <View className='flex-1 mt-[50px] bg-white justify-center items-center'>
            <Text className="text-xl mb-4">Bạn đang dùng chế độ khách</Text>
            <Text className="text-base mb-8 px-4 text-center">Để thực hiện hành động này, bạn cần đăng nhập bằng tài khoản.</Text>
            <TouchableOpacity
                className="bg-blue-500 py-3 px-8 rounded-full"
                onPress={() => navigation.replace('Login')}
            >
                <Text className="text-white font-bold">Đăng nhập ngay</Text>
            </TouchableOpacity>
        </View>
    );
};


export default LoginRequirement