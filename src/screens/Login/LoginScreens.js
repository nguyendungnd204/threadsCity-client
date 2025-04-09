import { View, Button, Alert, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


const LoginScreens = () => {
    
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();

    async function onFacebookButtonPress() {
        try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                throw new Error('User cancelled the login process');
            }

            // Once signed in, get the user's AccessToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                throw new Error('Something went wrong obtaining access token');
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(facebookCredential);

            // Navigate to the next screen after successful login
            navigation.navigate('Tabs');
        } catch (error) {
            // Handle login errors
            Alert.alert('Login failed', error.message || 'Something went wrong. Please try again.');
        }
    }

    return (
        <View className='flex-1 justify-center items-center bg-black '>
            <TouchableOpacity 
            className="bg-[#4267B2] p-3 rounded-lg" 
                onPress={onFacebookButtonPress}
            >
                <Text className="text-black text-[20px] font-bold">
                Facebook Sign-In
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginScreens;
