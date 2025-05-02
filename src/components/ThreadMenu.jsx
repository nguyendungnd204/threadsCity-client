import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable,Image } from 'react-native';
import Modal from 'react-native-modal';
import { icons } from '../constants/icons';

const ThreadsLikeMenu = () => {
  const [visible, setVisible] = useState(false);

  const handleOption = (action) => {
    setVisible(false);
    alert(`Bạn chọn: ${action}`);
  };

  return (
    <View>
      {/* Nút ba chấm */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image source={icons.more} className="w-[18px] h-[18px] self-end right-2" tintColor="gray"/>
      </TouchableOpacity>

      {/* Bottom Sheet */}
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
                <Pressable className="py-4 border-b border-b-gray-300" onPress={() => handleOption("Ẩn bài viết")}>
                    <Text className="text-xl font-medium">Ẩn bài viết</Text>
                </Pressable>
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
