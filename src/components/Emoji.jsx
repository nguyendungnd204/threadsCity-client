import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import PropTypes from 'prop-types';

const EmojiModal = ({ isVisible, onClose, onSelectEmoji }) => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetchEmojis();
    }
  }, [isVisible]);

  const fetchEmojis = async () => {
    try {
      const response = await axios.get('https://www.emoji.family/api/emojis', {
        params: {
          group: 'smileys-emotion',
        },
      });
      setEmojis(response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API emoji:', error);
      setEmojis([
        { emoji: '😀', hexcode: '1f600' },
        { emoji: '😃', hexcode: '1f603' },
        { emoji: '😄', hexcode: '1f604' },
      ]);
    }
  };

  const renderEmojiItem = ({ item }) => (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={() => {
        onSelectEmoji(item.emoji);
        onClose(); 
      }}
    >
      <Text style={styles.emojiText}>{item.emoji}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <FlatList
          data={emojis}
          renderItem={renderEmojiItem}
          keyExtractor={(item) => item.hexcode}
          numColumns={6}
          contentContainerStyle={styles.emojiList}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    maxHeight: '70%',
  },
  emojiList: {
    alignItems: 'center',
  },
  emojiItem: {
    padding: 5,
    margin: 5,
  },
  emojiText: {
    fontSize: 24,
  },
});

EmojiModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectEmoji: PropTypes.func.isRequired,
};

export default EmojiModal;