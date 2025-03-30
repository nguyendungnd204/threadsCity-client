import { Image, StyleSheet, View, TouchableOpacity} from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreens'
import FavoriteScreens from '../screens/FavoriteScreens'
import ProfileScreens from '../screens/ProfileScreens'
import SearchScreens from '../screens/SearchScreens'
import CreateScreens from '../screens/CreateScreens'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator();
const iconMap = {
    home: {
      active: require('../assets/images/home-clicked.png'),
      inactive: require('../assets/images/home.png'),
    },
    user: {
      active: require('../assets/images/user-clicked.png'),
      inactive: require('../assets/images/user.png'),
    },
    favorite: {
      active: require('../assets/images/heart-clicked.png'),
      inactive: require('../assets/images/heart.png'),
    },

  };
const IconTabs = ({ focused, color, size, name }) => {
  const iconSource = focused ? iconMap[name].active : iconMap[name].inactive;

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size }}
      resizeMode="contain"

    />
  );
};
const TabsNavigation = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: true,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#ccc',
            tabBarStyle: styles.tabBarStyle,
            tabBarPressColor: 'transparent',
        }}
    >
        <Tab.Screen 
            name='Home' 
            component={HomeScreen}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs focused={focused} color={color} size={size} name="home" />
                ),
                tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    activeOpacity={0.6}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                />
                ),
            }}
            />
        <Tab.Screen 
            name='Search' 
            component={SearchScreens}
            options={{
                tabBarIcon: () => (
                        <Image
                        source={require('../assets/images/search.png')}
                        style={{ width:28, height:28, tintColor: '#000' }}
                        resizeMode="contain"
                    />
                ),
                tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    activeOpacity={0.6}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                />
                ),
            }}
            />
        <Tab.Screen
            name="Create"
            component={CreateScreens}
            options={{
            tabBarIcon: () => (
                <View
                    style={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: -5, 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5, 
                    }}
                    >
                <Image
                source={require('../assets/images/plus.png')}
                style={{ width: 28, height: 28, tintColor: '#000' }} 
                resizeMode="contain"
                />
            </View>
            ),
            tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    activeOpacity={0.6}
                    style={{  flex: 1, width: 60,
                    height: 60,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: -5, 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5,  }}
                />
                ),
        }}
        />
        <Tab.Screen 
            name='Favorite' 
            component={FavoriteScreens}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs focused={focused} color={color} size={size} name="favorite" />
                    
                ),
                tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    activeOpacity={0.6}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                />
                ),
            }}
            />
        <Tab.Screen 
            name='Profile' 
            component={ProfileScreens}
                options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs focused={focused} color={color} size={size} name="user" />
                ),
                tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    activeOpacity={0.6}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                />
                ),
            }}
            />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    tabBarStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#fff',
        borderTopColor: '#ccc',
        borderTopWidth: 1 ,
    },
})

export default TabsNavigation