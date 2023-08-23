import { StyleSheet, View, RefreshControl, Pressable } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { theme } from '../style/theme'
import { Image, ScrollView, ToastAndroid } from 'react-native'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import List from '../components/Shared/List'
import { Chip, Text } from 'react-native-paper';
import { Media } from '../types/media'
import Search from '../components/Search'
import { MaterialIcons } from '@expo/vector-icons';
import ContinueWatching from '../components/ContinueWatching'
import analytics from '@react-native-firebase/analytics'
import { fetchGenre, fetchTrending } from '../store/context/homeSlice'
import { FlatList } from 'react-native-gesture-handler'
import { generateRandomColor } from '../utils/utils'

const logo = 'https://xpwatch.vercel.app/logo.png'

const Home = () => {
  const dispatch = useAppDispatch()
  const { all, movies, tv, anime, bollywood } = useAppSelector(state => state.home.trending)
  const [refreshing, setRefreshing] = React.useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await dispatch(fetchGenre())
      const res = await dispatch(fetchTrending())
      if (res.meta.requestStatus === 'fulfilled') {
        ToastAndroid.show('Refreshed', ToastAndroid.SHORT)
      }
    } catch (error) {
      console.log(error)
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
    } finally {
      setRefreshing(false)
    }
  }

  React.useEffect(() => {
    analytics().logScreenView({
      screen_name: 'Home',
      screen_class: 'Home'
    })
  }, [])

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <Stack.Screen options={{
        title: 'xpWatch',
        headerTitle: props => <Header />,
      }} />
      <View>
        <Search />
        <ContinueWatching />
        <List data={all} horizontal />
        <List data={movies as Media[]} name='Movies' horizontal />
        <List data={tv as Media[]} name='TV Shows' horizontal />
        <List data={(bollywood ?? []) as Media[]} name='Bollywood' horizontal />
        <List data={anime} name='Anime' horizontal />
      </View>
        <GenreList />
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
  genreChip: {
    margin: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: 15
  }
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

function GenreList () {
  const genrelist = useAppSelector(state => state.home.genre)
  return (
    <View>
      <Text>Genre</Text>
      <FlatList data={genrelist} numColumns={4} renderItem={({item}) => (
        <Chip onPress={()=> {
          router.push({
            pathname: 'genre',
            params: {
              id: item.id,
              name: item.name
            }
          })
        }} style={{
          ...styles.genreChip, backgroundColor: generateRandomColor(0.7)
        }} textStyle={{color: 'white'}}>{item.name}</Chip>
      )} />
      
    </View>
  )
}