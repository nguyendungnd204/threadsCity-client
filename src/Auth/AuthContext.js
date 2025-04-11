// src/Auth/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser,
        isGuest,
        setIsGuest,
        loading,
        setLoading,
        login: async (userData) => {
          setUser(userData);
          setIsGuest(false);
        },
        logout: () => {
          setUser(null);
          setIsGuest(false);
        },
        setGuest: () => {
          setUser(null);
          setIsGuest(true);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);