import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import CreateScreens from './src/screens/Create/CreateScreens';
import TabsNavigation from './src/navigation/TabsNavigation';
import LoginScreens from './src/screens/Login/LoginScreens';
import { AuthProvider, useAuth } from './src/Auth/AuthContext';
import './global.css';
import LoginRequirement from './src/screens/LoginRequirement/LoginRequirement';
import FeedDetailScreen from './src/screens/Home/FeedDetailScreen';
import EditProfile from './src/screens/UpdateProfle/UpdateProfile';
import ReplyComment from './src/screens/ReplyComment';
import UserProfileScreens from './src/screens/Profile/UserProfileScreen';
import { AlertProvider } from './src/components/Alert';
import MediaFile from './src/screens/Home/ImageOrVideoDetail';
import { icons } from './src/constants/icons';
import messaging from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';


const Stack = createNativeStackNavigator();
const AppContent = () => {
  async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  }
}
useEffect(() => {
  requestNotificationPermission();
}, []);
  const { user, loading, initialized } = useAuth();
  if (!initialized || loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Tabs'>
            <Stack.Screen
              name="Create"
              component={user ? CreateScreens : LoginRequirement}
              options={() => ({ 
                  headerShown: user ? true : false,
                  title: "Tạo Bài Viết",
                  headerTitleAlign: 'center'
              })}
            />
            <Stack.Screen
              name="EditProfile"
              component={user ? EditProfile : LoginRequirement}
              
            />
            <Stack.Screen
              name="FeedDetail"
              component={FeedDetailScreen}
              options={({ navigation}) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={icons.back} style={{ marginLeft: 20, width: 20, height: 20}}/>
                  </TouchableOpacity>
                ),
                title: "Bài Viết",
                headerShown: true,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen
              name='MediaFile'
              component={MediaFile}
              options={{ headerShown: false}}
            />
            <Stack.Screen 
              name="UserProfile" 
              component={UserProfileScreens}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Reply" 
              component={ReplyComment}
              options={{ headerShown: true, title: "Trả Lời", headerTitleAlign: 'center' }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreens}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="LoginRequirement"
              component={LoginRequirement}
            />
            <Stack.Screen
              name="Tabs"
              component={TabsNavigation}
              options={{ animation: 'slide_from_bottom' }}
            />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  // useNotification();

  return (
    <AlertProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default App;