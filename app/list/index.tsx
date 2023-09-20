import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { BottomNavigation, List, Searchbar, Text } from 'react-native-paper'
import { myListActions, selectAnime, selectRecents, selectMovie, selectTV, selectWatchedAlready } from '../../store/context/myListSlice';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { AniListDetail } from '../../types/anilistDetails';


const list = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'movie', title: 'Movie', focusedIcon: 'movie', },
        { key: 'tv', title: "TV Shows", focusedIcon: 'youtube-tv' },
        { key: 'anime', title: 'Anime', focusedIcon: 'airbag', },
        { key: 'watchedAlready', title: 'Watched Already', focusedIcon: 'playlist-check', },
        { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        movie: MovieList,
        tv: TvList,
        anime: AnimeList,
        watchedAlready: WatchedAlready,
        recents: Recents,
    });

    return (
        <View style={{
            flex: 1,
        }}>
            <Stack.Screen options={{
                title: 'Favorites',
            }} />
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </View>
    )
}

export default list

const styles = StyleSheet.create({})

function SearchBar() {
    const searchQuery = useAppSelector(state => state.myList.search)
    const dispatch = useAppDispatch()
    return (
        <Searchbar
            placeholder="Search"
            onChangeText={(query) => {
                dispatch(myListActions.setSearch(query))
            }}
            value={searchQuery}
        />
    )
}

function MovieList() {
    const data = useAppSelector(selectMovie)

    return (
        <ScrollView>
            <List.Section>
                <SearchBar />
                <List.Subheader>Movie List</List.Subheader>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.title}
                            description={item.overview}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }} style={{ width: 50, height: 75 }} />}
                            onPress={() => {
                                router.push('movie/' + item.id)
                            }}
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )
}

function TvList() {
    const data = useAppSelector(selectTV)

    return (
        <ScrollView>
            <List.Section>
                <SearchBar />
                <List.Subheader>TV List</List.Subheader>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.name}
                            description={item.overview}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }} style={{ width: 50, height: 75 }} />}
                            //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push('tv/' + item.id)
                            }
                            }
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )
}

function AnimeList() {
    const data = useAppSelector(selectAnime) as AniListDetail[]

    return (
        <ScrollView>
            <List.Section>
                <SearchBar />
                <List.Subheader>Anime List</List.Subheader>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.title.english ?? item.title.userPreferred}
                            description={item.description}
                            left={props => <Image {...props} source={{ uri: `${item.image }` }} style={{ width: 50, height: 75 }} />}
                            //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push('anilist/' + item.id)
                            }}
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )
}

function WatchedAlready() {
    const data = useAppSelector(selectWatchedAlready)

    return (
        <ScrollView>
            <List.Section>
                <List.Subheader>Watched Already List</List.Subheader>
                <SearchBar />
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.title?.english ?? item.title ?? item.name}
                            description={item.overview ?? item.description}
                            left={props => <Image {...props} source={{ uri: item.coverImage ??  item.image ?? `https://image.tmdb.org/t/p/w342${item.poster_path}` }} style={{ width: 50, height: 75 }} />}
                            //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push(item.type + '/' + item.id)
                            }}
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )
}

function Recents() {
    const data = useAppSelector(selectRecents)

    return (
        <ScrollView>
            {/* <Text> {JSON.stringify(data)} </Text> */}
            <List.Section>
                <List.Subheader>Recents</List.Subheader>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.title?.english ?? item.title ?? item.name}
                            description={item.overview ?? item.description}
                            left={props => <Image {...props} source={{ uri: item.coverImage ?? item.image ?? `https://image.tmdb.org/t/p/w342${item.poster_path}` }} style={{ width: 50, height: 75 }} />}
                            //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push(item.type + '/' + item.id)
                            }}
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )

}

function isAniList(item: any): item is AniListDetail {
    return Boolean(!item.slug)
}