import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { createThread } from "../../services/threadService";
import {useNavigation} from "@react-navigation/native";
import { icons } from "../../constants/icons";

const ProfileScreens = () => {
  const [activeTab, setActiveTab] = useState("Thread");
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Tôi là con người !!!!",
      date: "30.03.2023",
      likes: 10,
      comments: 10,
      reposts: 20,
      shares: 5,
    },
    {
      id: 2,
      content: "Tôi là con người !!!!",
      date: "30.03.2023",
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
    },
  ]);

  const handleCreateThread = async () => {
    try {
      const data = {
        authorId: "dungdep_trai",
        content: "Một ngày tuyệt vời tại Đà Lạt!",
        image: "https://example.com/image.jpg", 
        createdAt: new Date().toISOString(),
      };
      
      console.log("Data to be sent:", data);
      const response = await createThread(data);
      console.log("Response:", response);
      
      
    } catch (error) {
      console.error("Error in handleCreateThread:", error);
    }
  };
  const handleLogout = () => {
    navigation.replace('Login');
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

  const renderPost = ({ item }) => (
    <View className="flex-row p-3 border-b border-gray-100 mt-5">
      <Image
        source={icons.user}
        className="w-10 h-10 rounded-full mr-2.5"
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <Text className="font-semibold text-base">Nguyễn Dũng</Text>
          <Text className="text-base text-gray-500">{item.date}</Text>
        </View>
        <Text>{item.content}</Text>
        <View className="flex-row mt-2 space-x-3">
          <TouchableOpacity className="flex-row items-center space-x-1">
            <Image source={icons.unlike} className="w-5 h-5" resizeMode="contain" />
            <Text className="text-xl font-normal text-gray-600 ml-1 mr-1">{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center space-x-1">
          <Image source={icons.chat} className="w-5 h-5" resizeMode="contain"/>
            <Text className="text-xl text-gray-600 ml-1 mr-1">{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center space-x-1">
          <Image source={icons.repeat} className="w-5 h-5" resizeMode="contain"/>
            <Text className="text-xl text-gray-600 ml-1 mr-1">{item.reposts}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center space-x-1">
          <Image source={icons.send} className="w-5 h-5" resizeMode="contain"/>
            <Text className="text-xl text-gray-600 ml-1 mr-1">{item.shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyContent = () => (
    <View className="items-center p-5">
      <Text className="text-gray-500">
        {activeTab === "Thread trả lời" ? "Bạn chưa trả lời thread nào" : "Bạn chưa đăng lại thread nào"}
      </Text>
    </View>
  );

  const dataToShow = activeTab === "Thread" ? posts : [];

  return (
    <View className='flex-1 mt-[50px] bg-white'>
      <View className="flex-row justify-between items-center p-3 border-b border-gray-300">
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain"/>
        <TouchableOpacity onPress={handleLogout}>
        <Image 
          source={icons.more} 
          className="w-5 h-5" 
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Image source={icons.search} className="w-5 h-5" resizeMode="contain"/>
        <View className="flex-row space-x-2">
        <Image source={icons.more} className="w-5 h-5" resizeMode="contain"/>
        </View>
      </View>

      <View className="flex-row justify-between items-center p-4">
        <View>
          <Text className="font-bold text-xl">Nguyễn Dũng</Text>
          <Text className="text-gray-600 text-base">dung_dep_trai</Text>
          <Text className="mt-1 text-base text-gray-700">Tuyệt</Text>
          <Text className="mt-1 text-base text-gray-500">0 followers</Text>
        </View>
        <Image
          source={require("../../assets/images/user.png")}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <View className="flex-row space-x-2 px-4 mt-2 pb-5">
        <TouchableOpacity onPress={handleCreateThread} className="flex-1 border border-gray-300 p-2 items-center rounded-md">
          <Text>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
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
        data={dataToShow}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderPost}
        ListEmptyComponent={renderEmptyContent}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default ProfileScreens;
