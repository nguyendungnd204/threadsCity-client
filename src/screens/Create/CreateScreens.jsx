import { SafeAreaView } from 'react-native';
import React from 'react';
import CreateThreadsComponents from '../../components/CreateThreadsComponents';
import { useAuth } from '../../Auth/AuthContext';
import { getUserById } from '../../services/userService';
import useFetch from '../../services/useFetch';

const CreateScreens = () => {
  const { user } = useAuth();
  const { data: userProfile } = useFetch(() => getUserById(user?.oauthId), true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CreateThreadsComponents user={userProfile} />
    </SafeAreaView>
  );
};

export default CreateScreens;
