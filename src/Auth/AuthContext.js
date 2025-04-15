import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const checkLoginSession = async () => {
  try {
    const sessionString = await AsyncStorage.getItem('userSession');
    if (!sessionString){
      return null;
    } 
    const session = JSON.parse(sessionString);
    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await checkLoginSession();
        setAuthState({
          user: session?.user || null,
          loading: false,
          initialized: true
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          loading: false,
          initialized: true
        });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      const session = {
        user: userData,
      };
      
      await AsyncStorage.setItem('userSession', JSON.stringify(session));
      setAuthState({
        user: userData,
        loading: false,
        initialized: true
      });
      return true;
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
        loading: false,
        initialized: true
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setLoading: (isLoading) => 
          setAuthState(prev => ({ ...prev, loading: isLoading }))
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};