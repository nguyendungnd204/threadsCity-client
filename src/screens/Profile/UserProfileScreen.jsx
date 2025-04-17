import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useAuth } from "../../Auth/AuthContext";
import Profile from "../../components/Profile";

const UserProfileScreens = () => {
    const route = useRoute();
    const { id } = route.params;

  useEffect(() => {
    console.log(id)
  },[]);

  return (
      <Profile userId={id} />
  );
};

export default UserProfileScreens;
