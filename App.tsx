import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import CreateScreens from './src/screens/Create/CreateScreens';
import TabsNavigation from './src/navigation/TabsNavigation';
import LoginScreens from './src/screens/Login/LoginScreens';
import { AuthProvider, useAuth } from './src/Auth/AuthContext';
import './global.css';
import LoginRequirement from './src/screens/LoginRequirement/LoginRequirement';
import FeedDetailScreen from './src/screens/Home/FeedDetailScreen';
import EditProfile from './src/screens/UpdateProfle/UpdateProfile';
import ReplyComment from './src/screens/ReplyComment';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, loading, initialized } = useAuth();

  // Hiển thị loading cho đến khi khởi tạo xong
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
              options={user ? { headerShown: true } : { headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={user ? EditProfile : LoginRequirement}
              
            />
            <Stack.Screen 
              name="FeedDetail" 
              component={FeedDetailScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen 
              name="Reply" 
              component={ReplyComment}
              options={{ headerShown: true }}
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
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