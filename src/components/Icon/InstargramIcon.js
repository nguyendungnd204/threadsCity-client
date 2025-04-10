import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const InstargramIcon = () => {
  return (
    <Image
        source={require('../../assets/images/instagram_icon.webp')}
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
export default InstargramIcon