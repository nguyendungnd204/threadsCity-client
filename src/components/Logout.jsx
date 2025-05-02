import React from "react";
import { TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../Auth/AuthContext";
import { icons } from "../constants/icons";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await auth().signOut();
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Lỗi", "Đăng xuất thất bại.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Image source={icons.logout} className="w-7 h-7" resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default LogoutButton;
