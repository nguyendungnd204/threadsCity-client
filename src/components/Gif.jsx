import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput, FlatList, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { icons } from '../constants/icons';
import CreateIcons from './CreateIcons';
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;
const modalHeight = screenHeight * (3 / 4);

const Gif = ({ onSelectGif }) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef(null);

  const GIPHY_API_KEY = 'Vx7MpJ8CjDnvzrKZN0arOzxxfAxASuO4';

  const searchGifs = async (query) => {
    if (!query.trim()) {
      fetchTrendingGifs();
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          limit: 20,
          rating: 'pg',
        },
      });
     
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingGifs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/trending', {
        params: {
          api_key: GIPHY_API_KEY,
          limit: 20,
          rating: 'pg',
        },
      });
     
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchTrendingGifs();
    }
  }, [visible]);

  const handleSelectGif = (gifUrl) => {
    if (onSelectGif) {
      onSelectGif(gifUrl);
    }
    setVisible(false);
  };

  const renderGifItem = ({ item }) => {
    const gifUrl = item.images.original.url; 

    return (
      <TouchableOpacity
        onPress={() => handleSelectGif(gifUrl)}
        className="flex-1 rounded-lg overflow-hidden"
        style={{ aspectRatio: 1 }}
      >
        <Image
          source={{ uri: gifUrl }}
          className="w-full h-full m-2 rounded-xl"
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchTrendingGifs();
    textInputRef.current?.blur();
  };

  return (
    <View>
      {/* Nút ba chấm */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <CreateIcons source={icons.gif} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}
        backdropOpacity={0.4}
      >
        <View className="w-full px-5 pb-5 rounded-t-2xl bg-gray-100 shadow-lg" style={{ height: modalHeight }}>
          {/* Thanh tìm kiếm */}
          <View
            className={`flex-row items-center bg-white rounded-full px-4 py-1 mt-3 shadow-sm ${
              isFocused ? 'border-gray-400' : 'border-gray-300'
            } border`}
          >
            <Image
              source={icons.search}
              className="w-5 h-5 mr-3"
              resizeMode="contain"
              tintColor={isFocused ? '#3b82f6' : '#9ca3af'}
            />
            <TextInput
              ref={textInputRef}
              placeholder="Tìm kiếm GIF..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchGifs(text);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 text-base text-black"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="p-1.25">
                <Image
                  source={icons.close}
                  className="w-5 h-5"
                  resizeMode="contain"
                  tintColor="#9ca3af"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Hiển thị danh sách GIF */}
          {loading ? (
            <ActivityIndicator size="large" color="#000" className="mt-5" />
          ) : (
            <FlatList
              data={gifs}
              renderItem={renderGifItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerClassName="pt-2.5"
              ListEmptyComponent={<Text className="text-center text-gray-500 mt-5">Không tìm thấy GIF</Text>}
            />
          )}
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

export default Gif;