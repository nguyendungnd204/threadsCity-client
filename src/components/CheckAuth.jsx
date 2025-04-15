import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Auth/AuthContext";

const CheckAuth = ({ children, requireAuth = true }) => {
  const { user, isGuest, loading, initialized } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!initialized) return;

    if (requireAuth) {
      if (isGuest || !user) {
        navigation.navigate("LoginRequirement");
      }
      if (user && !isGuest) {
        navigation.replace("Tabs");
      }
    }
  }, [user, isGuest, initialized, requireAuth]);

  if (!initialized || loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (requireAuth ? (user && !isGuest) : (!user || isGuest)) {
    return children;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default CheckAuth;