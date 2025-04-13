// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/AuthContext";

const CheckAuth = ({ children, requireAuth = true }) => {
  const { user, isGuest, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && (isGuest || !user)) {
        navigation.replace("LoginRequirement");
      }

      if (!requireAuth && user && !isGuest) {
        navigation.replace("Tabs");
      }
    }
  }, [user, isGuest, loading, requireAuth]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return children;
};

export default CheckAuth;
