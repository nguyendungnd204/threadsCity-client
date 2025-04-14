// src/Auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const checkLoginSession = async () => {
  try {
    const session = await AsyncStorage.getItem('userSession');
    console.log('Retrieved session:', session); 
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isGuest: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const session = await checkLoginSession();
      if (session) {
        setAuthState({
          user: session.user,
          isGuest: false,
          loading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('userSession', JSON.stringify({
        user: userData,
        timestamp: new Date().getTime()
      }));
      setAuthState({
        user: userData,
        isGuest: false,
        loading: false
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      setAuthState({
        user: null,
        isGuest: false,
        loading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setGuest = () => {
    setAuthState({
      user: null,
      isGuest: true,
      loading: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isGuest: authState.isGuest,
        loading: authState.loading,
        login,
        logout,
        setGuest,
        setLoading: (isLoading) => 
          setAuthState(prev => ({ ...prev, loading: isLoading }))
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);