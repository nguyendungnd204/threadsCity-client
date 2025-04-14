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

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { loading } = useAuth();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
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
            name="FeedDetail" 
            component={FeedDetailScreen}
            options={{ animation: 'slide_from_bottom', headerShown: true }}
          />
          <Stack.Screen
            name="Login"
            options={{ animation: 'slide_from_bottom' }}
            component={LoginScreens}
          />
            
          <Stack.Screen
            name="LoginRequirement"
            options={{ animation: 'slide_from_bottom' }}
            component={LoginRequirement}
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