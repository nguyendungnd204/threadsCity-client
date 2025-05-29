// ThreadsLikeMenu.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { icons } from '../constants/icons';
import { useAuth } from '../Auth/AuthContext';
import { deleteThreadById } from '../services/threadService';
import { deleteCommentById } from '../services/commentService';

const ThreadsLikeMenu = ({ thread, refetch, followThreadRefetch }) => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  const handleOption = (action) => {
    setVisible(false);

    Alert.alert(`Bạn chọn: ${action}`);
  };  

  const handleDeleteThread = async () => {
    try {
      if (thread.id && thread.threadId) {
        console.log(thread.id)
        Alert.alert(
          "Thông báo",
          "Bạn có thật sự muốn xóa bình luận này không",
          [
            {
              text: "Hủy",
              onPress: () => {
                console.log("Hủy bỏ");
                setVisible(false);
              },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const result = await deleteCommentById(thread.id, user.oauthId, thread.threadId);
                if (result.success) {
                  setVisible(false);
                  // Gọi làm mới dữ liệu
                  await Promise.all([refetch(), followThreadRefetch()]);
                  Alert.alert('Thông báo', 'Đã xóa bài viết');
                } else {
                  Alert.alert('Lỗi', 'Xóa bài viết thất bại');
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else if (thread.threadid) {
        console.log(thread.threadid)
        Alert.alert(
          "Thông báo",
          "Bạn có thật sự muốn xóa bài viết không",
          [
            {
              text: "Hủy",
              onPress: () => {
                console.log("Hủy bỏ");
                setVisible(false);
              },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const result = await deleteThreadById(thread.threadid, user.oauthId);
                if (result.success) {
                  setVisible(false);
                  // Gọi làm mới dữ liệu
                  await Promise.all([refetch(), followThreadRefetch()]);
                  Alert.alert('Thông báo', 'Đã xóa bài viết');
                } else {
                  Alert.alert('Lỗi', 'Xóa bài viết thất bại');
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      Alert.alert('Lỗi', 'Xóa bài viết thất bại: ' + error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image source={icons.more} className="w-[18px] h-[18px] self-end right-2" tintColor="gray" />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}
        backdropOpacity={0.4}
      >
        <View className="h-[330px] w-full px-5 pb-5 rounded-t-2xl bg-gray-100 shadow-lg">
          <View className="flex-1 px-2 mt-8 border rounded-xl bg-white border-gray-200">
            <Pressable className="py-4 border-b border-b-gray-300" onPress={() => handleOption("Tố cáo")}>
              <Text className="text-xl font-medium">Tố cáo</Text>
            </Pressable>
            {user?.oauthId === thread.authorId && (
              <Pressable className="py-4 border-b border-b-gray-300" onPress={handleDeleteThread}>
                <Text className="text-xl font-medium">Xóa bài viết</Text>
              </Pressable>
            )}
            <Pressable className="py-4 border-b border-b-gray-300" onPress={() => setVisible(false)}>
              <Text className="text-xl font-medium text-red-500">Hủy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default ThreadsLikeMenu;