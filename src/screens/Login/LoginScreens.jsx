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
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerData[0]?.providerId
      };
      
      login(userData);
      navigation.navigate('Tabs');
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during Facebook login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      let idToken = signInResult.data?.idToken || signInResult.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      const userData = {
        uid: userCredential.user.uid,
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        providerId: userCredential.user.providerData[0]?.providerId
      };
      
      login(userData);
      navigation.navigate('Tabs');
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during Google login');
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
        <Text style={styles.title}>How would you like to use Threads?</Text>

        <View style={styles.buttonContainer}>
            <ButtonLogin
                style={styles.loginButton}
                onPress={handleFacebookLogin}
                disabled={loading}
                loading={loading}
                name="Facebook"
            />

            <ButtonLogin
                style={styles.loginButton}
                onPress={handleGoogleLogin}
                disabled={loading}
                loading={loading}
            />

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Use without a profile</Text>
              <Icon name="chevron-forward" size={24} color="#acacac" />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse Threads without a profile, but won't be able to post, interact or get
              personalised recommendations.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity disabled={loading}>
            <Text style={styles.switchAccountButtonText}>Switch accounts</Text>
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