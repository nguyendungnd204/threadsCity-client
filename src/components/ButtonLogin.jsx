import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import InstargramIcon from './Icon/InstargramIcon';
import GoogleIcon from './Icon/GoogleIcon';

const ButtonLogin = ({ style, onPress, disabled, loading, name }) => {
    return (
      <TouchableOpacity 
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <View style={styles.loginButtonContent}>
            {name === 'Facebook' ? <InstargramIcon/> : <GoogleIcon />}
            <Text style={styles.loginButtonText}>
            {name === 'Facebook' ? 'Continue with Facebook' : 'Continue with Google'}
            </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
const styles = StyleSheet.create({
    loginButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
})

export default ButtonLogin