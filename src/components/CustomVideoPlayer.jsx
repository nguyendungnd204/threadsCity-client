import React, { useRef, useState, forwardRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';

const CustomVideoPlayer = forwardRef(({ uri, size = { width: 240, height: 240 } }, ref) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  React.useImperativeHandle(ref, () => ({
    togglePlayPause: () => setIsPlaying((prev) => !prev),
  }));

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View className={`relative rounded-xl overflow-hidden mb-3`} style={{ width: size.width, height: size.height }}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        paused={!isPlaying}
        muted={isMuted}
        repeat
      />

      {/* Nút play/pause ở giữa */}
      <TouchableOpacity
        className="absolute top-[45%] left-[45%] bg-black/40 rounded-full w-10 p-2"
        onPress={handlePlayPause}
      >
        <Text className="text-white text-2xl text-center">{isPlaying ? '||' : '▶'}</Text>
      </TouchableOpacity>

      {/* Nút mute/unmute ở góc phải trên */}
      <TouchableOpacity
        className="absolute top-2 right-2 bg-black/40 rounded-full p-2"
        onPress={handleMuteToggle}
      >
        <Text className="text-white text-lg">{isMuted ? '🔇' : '🔊'}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default CustomVideoPlayer;
