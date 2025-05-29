import React, { useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import Profile from "../../components/Profile";

const ProfileScreens = () => {
  const { user } = useAuth();

  return (
      <Profile userId={user.oauthId} />
  );
};

export default ProfileScreens;
