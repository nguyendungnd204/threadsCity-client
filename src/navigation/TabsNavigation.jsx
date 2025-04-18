import { Image, StyleSheet, View, TouchableOpacity} from 'react-native'
import React from 'react'

import HomeScreen from '../screens/Home/HomeScreens'
import ProfileScreens from '../screens/Profile/ProfileScreens'
import SearchScreens from '../screens/Search/SearchScreens'
import CreateScreens from '..//screens/Create/CreateScreens'
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import IconTabs from '../components/CustomIcon';
import ActivityScreens from '../screens/Activity/FavoriteScreens'
import { useAuth } from '../Auth/AuthContext'
import LoginRequirement from '../screens/LoginRequirement/LoginRequirement'

const Tab = createBottomTabNavigator();
const TabsNavigation = () => {
    const navigation = useNavigation()
    const {user, isGuest} = useAuth()
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
        }
        }
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
                headerShown: false,
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
                headerShown: false,
            }}
            />
        <Tab.Screen
            name="CreateTab"
            component={CreateScreens}
            initialParams={{ userId: user ? user.id : null }}
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs 
                        focused={focused} 
                        color={color} 
                        size={size} 
                        name="create" 
                    />
                ),
                tabBarButton: (props) => (
                    <TouchableOpacity
                        {...props}
                        onPress={user && !isGuest ? () => navigation.navigate('Create') : () => navigation.navigate('LoginRequirement')}
                        style={{
                            flex: 1,
                            width: 70,
                            height: 50,
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
                            marginLeft: 5,
                            marginBottom: 15,
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
            component={user && !isGuest ? ActivityScreens : LoginRequirement}
            initialParams={{ userId: user ? user.id : null }}
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
                headerShown: false,
            }}
            />
        <Tab.Screen 
            name='Profile' 
            component={user && !isGuest ? ProfileScreens : LoginRequirement}
            initialParams={{ userId: user ? user.id : null }}
                options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <IconTabs focused={focused} color={color} size={size} name="user" />
                ),
                headerShown: false,
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