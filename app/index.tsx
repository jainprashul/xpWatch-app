import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { theme } from '../style/theme'
import { Image, ScrollView } from 'react-native'
import { useAppSelector } from '../store/hooks'
import List from '../components/Shared/List'
import { Text } from 'react-native-paper';
import { Media } from '../types/media'
import Search from '../components/Search'
import { MaterialIcons } from '@expo/vector-icons';
import ContinueWatching from '../components/ContinueWatching'

const logo = 'https://xpwatch.vercel.app/logo.png'



const Home = () => {
  const { all, movies, tv, anime } = useAppSelector(state => state.home.trending)
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{
        title: 'xpWatch',
        headerTitle: props => <Header />,
      }} />
      <View>
        <Search />
        <ContinueWatching />
        <List data={all} />
        <List data={movies as Media[]} name='Movies' />
        <List data={tv as Media[]} name='TV Shows' />
        <List data={anime} name='Anime' />
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 10
  },
})


export function Header() {
  return (
    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
        <Image
          style={{ width: 40, height: 30 }}
          source={{ uri: logo }}
        />
        <Text> xpWatch</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: "center", marginRight: 24 }}>
        <MaterialIcons name="favorite" size={30} color="#fff" onPress={() => {
          router.push('list')
        }} />
      </View>
    </View>
  );
}