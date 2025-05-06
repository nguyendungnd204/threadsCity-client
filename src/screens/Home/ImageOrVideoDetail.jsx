import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { icons } from '../../constants/icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import useFetch from '../../services/useFetch';
import { getThreadById } from '../../services/threadService';
import CustomVideoPlayer from '../../components/CustomVideoPlayer';

// Lấy kích thước màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MediaFile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { threadid } = route.params || {};
  const { data: thread } = useFetch(() => getThreadById(threadid), true);

  useEffect(() => {
    console.log("Thread: ", thread?.mediaFiles);
  }, [thread]);

  const handleVideoPress = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.togglePlayPause(); // Giả sử CustomVideoPlayer có phương thức togglePlayPause
    }
  };

  return (
    <View className="flex-1 bg-black relative">
      {thread?.mediaFiles && Object.values(thread?.mediaFiles).length > 0 ? (
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={Object.values(thread.mediaFiles).filter(
            (media) => media && (media.imageUrl || media.videoUrl)
          )}
          keyExtractor={(media, index) => media.id || `${thread.threadid}-media-${index}`}
          renderItem={({ item: media }) =>
            media.imageUrl ? (
              <Image
                source={{ uri: media.imageUrl }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                resizeMode="contain"
              />
            ) : media.videoUrl ? (
              <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleVideoPress(videoRef)} activeOpacity={0.8}>
                  <CustomVideoPlayer
                    uri={media.videoUrl}
                    size={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * (16 / 9) }} // 16:9 tỷ lệ
                    ref={(ref) => (videoRef = ref)}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }
          style={{ flex: 1, }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Không có media để hiển thị</Text>
        </View>
      )}

      <TouchableOpacity
        className="absolute mt-8 left-1 z-100"
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Image
          source={icons.close}
          className="w-10 h-10"
          tintColor={'white'}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default MediaFile;