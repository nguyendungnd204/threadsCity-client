import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ProfileScreens = () => {
  const [activeTab, setActiveTab] = useState("threads");
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Tôi là con người !!!!",
      date: "30.03.2023",
      likes: 0,
      comments: 0,
      reposts: 0,
    },
    {
      id: 2,
      content: "Tôi là con người !!!!",
      date: "30.03.2023",
      likes: 0,
      comments: 0,
      reposts: 0,
    },
  ]);

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
        source={require("../../assets/images/user.png")}
        className="w-10 h-10 rounded-full mr-2.5"
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <Text className="font-semibold">Nguyễn Dũng</Text>
          <Text className="text-xs text-gray-500">{item.date}</Text>
        </View>
        <Text>{item.content}</Text>
        <View className="flex-row mt-2 space-x-3">
          <TouchableOpacity className="flex-row items-center space-x-1">
            <Icon name="heart" size={16} color="#999" />
            <Text className="text-xs text-gray-600">{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center space-x-1">
            <Icon name="message-circle" size={16} color="#999" />
            <Text className="text-xs text-gray-600">{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center space-x-1">
            <Icon name="repeat" size={16} color="#999" />
            <Text className="text-xs text-gray-600">{item.reposts}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="share" size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-3 border-b border-gray-300">
        <Icon name="user" size={20} />
        <View className="flex-row space-x-2">
          <Icon name="wifi" size={18} />
          <Icon name="battery" size={18} />
        </View>
      </View>

      <View className="flex-row justify-between items-center p-4 ">
        <View>
          <Text className="font-bold text-lg">Nguyễn Dũng</Text>
          <Text className="text-gray-600 text-sm">dung_dep_trai</Text>
          <Text className="mt-1 text-sm text-gray-700">Tuyệt</Text>
          <Text className="mt-1 text-sm text-gray-500">0 followers</Text>
        </View>
        <Image
          source={require("../../assets/images/user.png")}
          className="w-16 h-16 rounded-full border-2 border-white"
        />
      </View>

      <View className="flex-row space-x-2 px-4 mt-2 pb-5">
        <TouchableOpacity className="flex-1 border border-gray-300 p-2 items-center rounded-md">
          <Text>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-gray-300 p-2 items-center rounded-md">
          <Text>Follow</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row border-b border-gray-300">
        {renderTabButton("threads")}
        {renderTabButton("replies")}
        {renderTabButton("reposts")}
      </View>

      <ScrollView>
        {activeTab === "threads" ? (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPost}
          />
        ) : (
          <View className="items-center p-5">
            <Text className="text-gray-500">
              {activeTab === "replies" ? "No replies yet" : "No reposts yet"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreens;
