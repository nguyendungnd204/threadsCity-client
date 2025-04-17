import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../Auth/AuthContext";
import Profile from "../../components/Profile";

const ProfileScreens = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.oauthId) {
      console.log('User ID:', user.oauthId);
    }
  }, [user]);

  return (
      <Profile userId={user.oauthId} />
  );
};

export default ProfileScreens;
