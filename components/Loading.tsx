import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { theme } from '../style/theme'

const Loading = () => {
  return (
    <View style={styles.container} >
      <ActivityIndicator size="large" />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : theme.colors.background,
    },
})