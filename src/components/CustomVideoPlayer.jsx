// components/CustomVideoPlayer.js
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';

const CustomVideoPlayer = ({ uri }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View className='mb-3'>
      <View className='w-[240px] h-[240px] rounded-xl overflow-hidden'>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          paused={!isPlaying}
          muted={isMuted}
          repeat
        />
      </View>
      <View  className='flex-row justify-around mt-[5px]'>
        <TouchableOpacity onPress={handlePlayPause}>
          <Text>{isPlaying ? '⏸️ Dừng' : '▶️ Phát'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMuteToggle}>
          <Text>{isMuted ? '🔇 Bật tiếng' : '🔊 Tắt tiếng'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomVideoPlayer;
