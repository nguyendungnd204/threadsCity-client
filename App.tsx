// App.js
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
import ProfileScreens from './src/screens/Profile/ProfileScreens';
import ActivityScreens from './src/screens/Activity/FavoriteScreens';


const Stack = createNativeStackNavigator();

const AppContent = () => {
  const {user, isGuest, loading } = useAuth();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user || isGuest ? (
            <>
              <Stack.Screen
                name="Tabs"
                component={TabsNavigation}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="Create"
                component={CreateScreens}
                options={{ animation: 'slide_from_bottom', headerShown: true }}
              />
              <Stack.Screen 
                name="Profile"
                component={ProfileScreens}
                options={{ animation: 'slide_from_bottom', headerShown: true }}
              />
              <Stack.Screen 
                name="Activity"
                component={ActivityScreens}
                options={{ animation: 'slide_from_bottom', headerShown: true }}
              />
            </>
          ) : (
            <>
              
              <Stack.Screen
                name="LoginRequirement"
                component={LoginRequirement}
                options={{ animation: 'slide_from_bottom' }}
              />
            </>
          )}

          <Stack.Screen
                name="Login"
                component={LoginScreens}
                options={{ animation: 'slide_from_bottom' }}
              />
          <Stack.Screen 
            name="FeedDetail" 
            component={FeedDetailScreen}
            options={{ animation: 'slide_from_bottom', headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
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