import { StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import { animeX, search } from '../../utils/constants'
import { Media, Result } from '../../types/media'
import { Anime, AnimeRes } from '../../types/anime'
import { groupBy } from '../../utils/utils'
import List from '../../components/Shared/List'
import { Text } from 'react-native-paper'
import { theme } from '../../style/theme'

const Search = () => {
  const { query } = useLocalSearchParams()
  const [data, setData] = React.useState({
    movie: [],
    tv: [],
    person: [],
    anime: [],
    all: [],
    total: 0,
    page: 0
  } as { movie: Media[], tv: Media[], person: Media[], anime: Anime[], all: (Media | Anime)[], total: number, page: number })
  console.log(query)
  React.useEffect(() => {
    const q = query?.toString().trim();
    if (q) {
      console.log('Searching for', q)
      fetchSearch(q).then((res) => {

        setData(res)
      }
      )
    }
  }, [query])

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{

        title: `Search - ${query}`,
      }} />

      <List data={data.all} name={`${data.total}`} />

    </ScrollView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
})

async function fetchSearch(query: string, page: number = 1) {
  const tmdb = fetch(search.all(query, page))
  const animex = fetch(animeX.search(query, page))
  const [tmdbRes, animexRes] = await Promise.all([tmdb, animex])
  const tmdbData = await (await tmdbRes.json()) as Result
  const animexData = await (await animexRes.json()) as AnimeRes

  const { movie, tv, person } = groupBy(tmdbData.results, 'media_type');

  return {
    movie,
    tv,
    person,
    anime: animexData.data,
    all: [...tmdbData.results, ...animexData.data].sort((a, b) => a.popularity > b.popularity ? -1 : 1),
    total: tmdbData.total_results + animexData.meta.total,
    page: tmdbData.total_pages + animexData.meta.lastPage
  }
}
