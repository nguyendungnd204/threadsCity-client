/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreens from './src/screens/CreateScreens'
import TabsNavigation from './src/navigation/TabsNavigation';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen 
          name="Tab" 
          component={TabsNavigation} 
          options={{animation: 'slide_from_bottom'}}
          />
        <Stack.Screen 
          name="Create" 
          component={CreateScreens}
          options={{animation: 'slide_from_bottom'}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
