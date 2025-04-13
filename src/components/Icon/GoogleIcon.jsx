import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const GoogleIcon = () => {
  return (
    <Image
        source={require('../../assets/images/GoogleIcon.png')}
        style={styles.loginButtonImage}
    />
  )
}
const styles = StyleSheet.create({
    loginButtonImage: {
        width: 50,
        height: 50,
    },
})
export default GoogleIcon