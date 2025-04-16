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
    <View style={{ marginBottom: 12 }}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{ width: 240, height: 240, borderRadius: 12 }}
        resizeMode="cover"
        paused={!isPlaying}
        muted={isMuted}
        repeat
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
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
