// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import CreateScreens from './src/screens/CreateScreens';
import TabsNavigation from './src/navigation/TabsNavigation';
import LoginScreens from './src/screens/Login/LoginScreens';
import { AuthProvider, useAuth } from './src/Auth/AuthContext';
import './global.css';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { loading } = useAuth();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
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
            name="Login" 
            component={LoginScreens}
            options={{ animation: 'slide_from_bottom' }}
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