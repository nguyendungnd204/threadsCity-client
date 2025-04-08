import { View, Button, Alert } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useNavigation } from '@react-navigation/native';

const LoginScreens = () => {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title="Facebook Sign-In"
                onPress={onFacebookButtonPress} // Gọi trực tiếp hàm
            />
        </View>
    );
}

export default LoginScreens;
