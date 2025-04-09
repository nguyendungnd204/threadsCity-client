import { Image, StyleSheet, View, TouchableOpacity} from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreens'
import FavoriteScreens from '../screens/FavoriteScreens'
import ProfileScreens from '../screens/ProfileScreens'
import SearchScreens from '../screens/SearchScreens'
import CreateScreens from '../screens/CreateScreens'
import { useNavigation } from '@react-navigation/native';
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
    create: {
        active: require('../assets/images/plus.png'),
        inactive: require('../assets/images/plus.png'),
    },
    search: {
        active: require('../assets/images/search.png'),
        inactive: require('../assets/images/search.png'),
    },
  };
const IconTabs = ({ focused, color, size, name }) => {
  const iconSource = focused ? iconMap[name].active : iconMap[name].inactive;

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size, tintColor: focused ? 'black' : 'gray', }}
      resizeMode="contain"

    />
  );
};
const TabsNavigation = () => {
    const navigation = useNavigation();
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
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
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs focused={focused} color={color} size={size} name="search" />
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
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs 
                        focused={focused} 
                        color={color} // example custom focused color
                        size={size} 
                        name="create" 
                    />
                ),
                tabBarButton: (props) => (
                    <TouchableOpacity
                        {...props}
                        onPress={() => navigation.navigate('Create')}
                        style={{
                            flex: 1,
                            width: 60,
                            height: 80,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 5,
                            marginTop: 10, 
                            marginLeft: 10,
                            zIndex: 10
                        }}
                        activeOpacity={0.8}
                        accessibilityLabel="Create new item"
                        accessibilityRole="button"
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
        height: 90,
        backgroundColor: '#fff',
        borderTopColor: '#ccc',
        borderTopWidth: 1 ,
    },
})

export default TabsNavigation