import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../../constants/icons";
import { useAuth } from "../../Auth/AuthContext";
import auth from "@react-native-firebase/auth";
import Feed from "../../components/Feed";
import { getUserById } from "../../services/userService";
import LoginRequirement from "../LoginRequirement/LoginRequirement";
import CheckAuth from "../../components/CheckAuth";

const ProfileScreens = () => {
  const [activeTab, setActiveTab] = useState("Thread");
  const navigation = useNavigation();
  const { user, logout, isGuest } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userThreads, setUserThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userReplies, setUserReplies] = useState([]);
  const [userReposts, setUserReposts] = useState([]);

  const loadUserProfile = async () => {
    try {
      if (user && user.id) {
        const user = await getUserById(user.id);
        if (user) {
          setUserProfile(user);
        } else {
          setUserProfile({
            fullname: user.displayName || '',
            email: user.email || '',
            avatar: user.photoURL || '',
            username: user.email ? user.email.split('@')[0] : '',
            bio: '',
            followers: [],
            following: []
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

    }
  }
  const loadUserContent = async () => {
    try {
      if (!user || !user.id) return;
      
      const threads = await getUserThreads(user.id);
      setUserThreads(threads);
      
      const replies = await getUserReplies(user.id);
      setUserReplies(replies);
      
      const reposts = await getUserReposts(user.id);
      setUserReposts(reposts);
    } catch (error) {
      console.error("Error loading user content:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isGuest) {
          setLoading(false);
          return;
        }
        console.log("User ID:", user);
        await loadUserProfile();
        await loadUserContent();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isGuest]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
        await loadUserProfile();
        await loadUserContent();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
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
  const renderThreadItem = ({ item }) => {
    const threadData = {
      firstName: item.firstName,
      lastName: item.lastName,
      avatar_path: userProfile?.avatar,
      date: item.createdAt,
      content: item.content,
      mediaFiles: item.mediaFiles,
      likeCount: item.likeCount,
      commentCount: item.commentCount,
      retweetCount: item.retweetCount,
    }
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ThreadDetail", {
            threadId: item.id,
            userId: userProfile?.id,
          });
        }}
      >
        <Feed thread={threadData} />
      </TouchableOpacity>
    );

  }

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
        return userThreads.length > 0 ? userThreads.filter(thread => !thread.isReply && !thread.isRepost) : [];
      case "Thread trả lời":
        return userThreads.filter(thread => thread.isReply);
      case "Bài đăng lại":
        return userThreads.filter(thread => thread.isRepost);
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
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={icons.more}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center p-4">
        <View>
          <Text className="font-bold text-xl">{userProfile?.fullname }</Text>
          <Text className="mt-1 text-base text-gray-700">{userProfile?.bio}</Text>
          <Text className="mt-1 text-base text-gray-500">
            {userProfile?.followers ? (
              Array.isArray(userProfile.followers) ?
                userProfile.followers.length :
                Object.keys(userProfile.followers).length
            ) : 0} followers
          </Text>
        </View>
        <Image
          source={userProfile?.avatar ? { uri: userProfile.avatar } : require("../../assets/images/user.png")}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <View className="flex-row space-x-2 px-4 mt-2 pb-5">
        <TouchableOpacity
          className="flex-1 border border-gray-300 p-2 items-center rounded-md"
          onPress={() => navigation.navigate('EditProfile', { userProfile })}
        >
          <Text>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-gray-300 p-2 items-center rounded-md ml-5">
          <Text>Chia sẻ trang cá nhân</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row border-b border-gray-300">
        {renderTabButton("Thread")}
        {renderTabButton("Thread trả lời")}
        {renderTabButton("Bài đăng lại")}
      </View>

      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderThreadItem}
        ListEmptyComponent={renderEmptyContent}
        contentContainerStyle={{ flexGrow: 1 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default ProfileScreens;
