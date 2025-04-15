// src/screens/Login/LoginScreens.js
import React from 'react';
import { 
  View, 
  Alert, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../../Auth/AuthContext';
import ButtonLogin from '../../components/ButtonLogin';
import { database } from '../../../FirebaseConfig'; 
import SimpleToast from 'react-native-simple-toast';
import { icons } from '../../constants/icons';

import { createUser } from '../../services/userService';
const LoginScreens = () => {
  const navigation = useNavigation();
  const { setLoading, loading, login, setGuest } = useAuth();

  // Configure Google Signin
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: '935009471431-2i7iovd4c37tphf4oshkgnt79saom3d7.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Unable to get Access Token');
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      const userCredential = await auth().signInWithCredential(facebookCredential);
      
      const user = userCredential.user;
      const userId = user.uid;
      const userData = {
        oauthId: user.uid,
        fullname: user.displayName || '', 
        email: user.email,
        avatar: user.photoURL || '', 
        oauthProvider: user.providerData[0]?.providerId || 'facebook', 
        bio: '',
        status: 'active',
        role: 'user',
        followers: [],
        following: [],
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
      };
      await createUser(userId, userData);
      await login(userData);
      //navigation.navigate('Tabs');
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during Facebook login');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setGuest();
    navigation.navigate('Tabs');
  };

  return (
    <View style={styles.container}>
      <Image source={icons.login} style={styles.loginImage} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Chào mừng bạn đến với Thread</Text>

        <View style={styles.buttonContainer}>
            <ButtonLogin
                style={styles.loginButton}
                onPress={handleFacebookLogin}
                disabled={loading}
                loading={loading}
                name="Facebook"
            />

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Vào với tư cách khách</Text>
            </View>
            <Text style={styles.loginButtonSubtitle}>
            Bạn vẫn có thể xem Threads mà không cần đăng nhập, nhưng sẽ không thể đăng bài, tương tác hoặc nhận các đề xuất phù hợp với bạn
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8FF',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginImage: {
    width: '100%',
    height: 380,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 17,
    fontFamily: 'DMSans_500Medium',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#acacac',
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
    flex: 1,
  },
  loginButtonImage: {
    width: 50,
    height: 50,
  },
  loginButtonSubtitle: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: '#acacac',
    marginTop: 5,
  },
  switchAccountButtonText: {
    fontSize: 14,
    color: '#acacac',
    alignSelf: 'center',
  },
});

export default LoginScreens;