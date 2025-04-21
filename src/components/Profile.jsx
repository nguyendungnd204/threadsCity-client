import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../constants/icons";
import { useAuth } from "../Auth/AuthContext";
import auth from "@react-native-firebase/auth";
import useFetch from '../services/useFetch';
import { getThread, getUserThreads } from "../services/threadService";
import Feed from "./Feed";
import { getUserById } from "../services/userService";
import { followUser, unfollowUser, isFollowing } from "../services/followService";


const Profile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("Thread");
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { data: userProfile, loading: userLoading, refetch: refecthThead } = useFetch(() => getUserById(userId), true);
  // const { data: thread, loading, refetch: refetchUserProfile } = useFetch(getThread, true);
  const { data: thread, loading, refetch: refetchUserProfile } = useFetch(() => getUserThreads(userId), true);
  const flatListRef = useRef(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);


  useEffect(() => {
    if (userId) {
      console.log('User ID:', userId);
    }
  }, [userId]);
  useEffect(() => {
    if (user) {
      console.log('User:', user?.oauthId);
    }
  }, [user]);

  useEffect(() => {
    console.log(" data:", userProfile);
  }, [userProfile]);

  useEffect(() => {
    const checkFollowing = async () => {
      if (user?.oauthId && userId && user.oauthId !== userId) {
        const following = await isFollowing(user.oauthId, userId);
        setIsFollowingUser(following);
      }
    };
    checkFollowing();
  }, [user, userId]);

  useEffect(() => {
    if (userProfile?.followers) {
      setFollowerCount(Object.keys(userProfile.followers).length);
    }
  }, [userProfile]);

  const handleFollow = async () => {
    if (!user?.oauthId || user.oauthId === userId) return;

    try {
      if (isFollowingUser) {
        await unfollowUser(user.oauthId, userId);
        setIsFollowingUser(false);
        setFollowerCount((prev) => prev - 1);
      } else {
        await followUser(user.oauthId, userId);
        setIsFollowingUser(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  if (loading || userLoading) return <ActivityIndicator size="small" color="#0000ff" />;;

  const onRefresh = async () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    refetchUserProfile();
    refecthThead();
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);

    }
  }
  const handleThread = (id) => {
    navigation.navigate("FeedDetail", { id });
  };


  const renderTabButton = (label) => (
    <TouchableOpacity
      className={`flex-1 py-2 items-center ${activeTab === label ? "border-b-2 border-black" : ""}`}
      onPress={() => setActiveTab(label)}
    >
      <Text className={`${activeTab === label ? "text-black font-semibold" : "text-gray-500"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyContent = () => (
    <View className="items-center p-5">
      <Text className="text-gray-500">
        {activeTab === "Thread trả lời" ? "Bạn chưa trả lời thread nào" : "Bạn chưa đăng lại thread nào"}
      </Text>
    </View>
  );
  const getFilteredThreads = () => {
    switch (activeTab) {
      case "Thread":
        return [];
      case "Thread trả lời":
        return [];
      case "Bài đăng lại":
        return [];
      default:
        return [];
    }
  };
  const dataToShow = getFilteredThreads();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Đang tải...</Text>
      </View>
    );
  }


  return (
    <View className='flex-1 mt-[50px] bg-white'>
      <View className="flex-row justify-between items-center p-3 border-b border-gray-300">
        {user?.oauthId === userId ? (

          <Image source={icons.search} className="w-6 h-6" resizeMode="contain" />

        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={icons.back} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        )
        }
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={icons.close}
            className="w-7 h-7"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center p-4">
        <View>
          <Text className="font-bold text-xl">{userProfile?.fullname}</Text>
          <Text className="mt-1 text-base text-gray-700">{userProfile?.bio}</Text>
          <Text className="mt-1 text-base text-gray-500">
            {followerCount} người theo dõi
          </Text>
        </View>
        <Image
          source={userProfile?.avatar ? { uri: userProfile.avatar } : icons.user}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <View className="flex-row space-x-2 px-4 mt-2 pb-5">
        {user?.oauthId !== userId ? (
          <TouchableOpacity
            className={`flex-1 border border-gray-300 p-2 items-center rounded-md ${isFollowingUser ? 'bg-gray-100' : ''
              }`}
            onPress={handleFollow}
          >
            <Text>{isFollowingUser ? 'Đã theo dõi' : 'Theo dõi'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1 border border-gray-300 p-2 items-center rounded-md"
            onPress={() => navigation.navigate('EditProfile', { userProfile })}
          >
            <Text>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity  className="flex-1 border border-gray-300 p-2 items-center rounded-md ml-5">
          <Text>Chia sẻ trang cá nhân</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row border-b border-gray-300">
        {renderTabButton("Thread")}
        {renderTabButton("Thread trả lời")}
        {renderTabButton("Bài đăng lại")}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={thread || []}
        keyExtractor={(item) => item.threadid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleThread(item.threadid)}>
            <Feed thread={item} key={item.threadid} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export default Profile;