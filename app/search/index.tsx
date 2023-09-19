import { StyleSheet, ScrollView, View, FlatList, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { anilist, animeX, search, t } from '../../utils/constants'
import { Media, Result } from '../../types/media'
import { Anime, AnimeRes } from '../../types/anime'
import { groupBy } from '../../utils/utils'
import { SegmentedButtons, Text, List, Button } from 'react-native-paper'
import { theme } from '../../style/theme'
import Loading from '../../components/Loading'
import { getYear } from '../../components/Shared/List'
import { AnilistRes } from '../../types/anilist'

const Search = () => {

  const [loading, setLoading] = React.useState(false)
  const { query } = useLocalSearchParams()
  const [page, setPage] = React.useState(1)
  const [select, setSelect] = React.useState("all")
  const [data, setData] = React.useState<SearchResult>({
    movie: [],
    tv: [],
    person: [],
    anime: [],
    all: [],
    total: 0,
    pages: 0,
    show: 0
  })
  React.useEffect(() => {
    const q = query?.toString().trim();
    if (q) {
      console.log('Searching for', q)
      setLoading(true)
      fetchSearch(q, page).then((res) => {
        setData(res)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  }, [query, page])

  const currentData = data[select as keyof typeof data] as any[]

  if (loading) {
    return <>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <Loading />
    </>
  }


  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{
        headerShown: true,
        title: `Search - ${query}`,
      }} />

      <Text variant='labelSmall' style={{ marginVertical: 10 }}>Showing {data.show} of {data.total} results</Text>
      <SegmentedButtons
        density='small'
        value={select}
        onValueChange={(value) => {
          setSelect(value)
        }}
        buttons={['all', 'movie', 'tv', 'person', 'anime'].map((src) => {
          return { label: src.toLocaleUpperCase(), value: src }
        })}
      />

      <SearchList data={currentData} />

      {
        currentData?.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button disabled={page === 1} onPress={() => setPage(page - 1)}>Previous</Button>
          <Button disabled={page === data.pages} onPress={() => setPage(page + 1)}>Next</Button>
        </View>
      }





    </ScrollView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 10
  },
})

type SProps = {
  data: any[]
}
function SearchList({ data }: SProps) {
  return (
    <ScrollView>
      <List.Section>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const year = getYear(item.release_date ?? item.first_air_date ?? item.releaseDate ) ?? item.season ?? item.seasonYear ?? item.year
            return (
            <List.Item style={{ paddingHorizontal: 10 }}
              key={item.id}
              title={`${item.title?.userPreferred ?? item.title?.english ?? item.title ?? item.name} (${year})`}
              description={item.overview ?? item.description}
              left={props => <Image {...props} source={{ uri: item.coverImage ?? item.image ?? `https://image.tmdb.org/t/p/w342${item.poster_path}` }} style={{ width: 50, height: 75 }} />}
              onPress={() => {
                router.push(item.media_type + '/' + (item.slug ?? item.id))
              }}
            />
          )}}
        />
      </List.Section>
    </ScrollView>
  )
}

async function fetchSearch(query: string, page: number = 1) {
  const tmdb = fetch(search.all(query, page))
  const animex = fetch(anilist.search(query, page))
  const [tmdbRes, animexRes] = await Promise.allSettled([tmdb, animex])

  let tmdbData: Result = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
  }

  let animexData: AnilistRes = {
    currentPage: 0,
    hasNextPage: false,
    results: [],
  }

  if (tmdbRes.status === 'fulfilled' && tmdbRes.value?.ok) {
    tmdbData = await tmdbRes.value.json() 
  }

  if (animexRes.status === 'fulfilled' && animexRes.value?.ok) {
    animexData = await animexRes.value?.json()
    // console.log(animexData)
  }

  const { movie, tv, person } = groupBy(tmdbData.results, 'media_type') as { movie: Media[], tv: Media[], person: Media[] }
  const anime = animexData.results?.map((a) => ({ ...a, media_type: 'anilist' }));

  const tmdbFiltered = tmdbData.results.filter(v => v.poster_path !== null)

  return {
    movie,
    tv,
    person,
    anime,
    all: [...tmdbFiltered.filter(v => v.poster_path), ...anime],
    total: tmdbData.total_results + animexData.results.length,
    show: tmdbFiltered.length + animexData.results.length,
    pages: Math.max(tmdbData.total_pages, animexData.currentPage +  +(animexData.hasNextPage))
  }
}

type SearchResult = Awaited<ReturnType<typeof fetchSearch>>