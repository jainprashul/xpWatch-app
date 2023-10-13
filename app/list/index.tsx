import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { BottomNavigation, List, Searchbar, Text } from 'react-native-paper'
import { myListActions, selectAnime, selectRecents, selectMovie, selectTV, selectWatchedAlready } from '../../store/context/myListSlice';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';


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
                            description={`${item.year} | ${item.description}`}
                            left={props => <Image {...props} source={{ uri: item.poster as string }} style={{ width: 50, height: 75 }} />}
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
                <List.Subheader>Movie List</List.Subheader>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={item.id}
                            title={item.title}
                            description={`${item.year} | ${item.description}`}
                            left={props => <Image {...props} source={{ uri: item.poster as string }} style={{ width: 50, height: 75 }} />}
                            onPress={() => {
                                router.push('tv/' + item.id)
                            }}
                        />
                    )}
                />
            </List.Section>
        </ScrollView>
    )
}

function AnimeList() {
    const data = useAppSelector(selectAnime)

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
                            description={`${item.year} | ${item.description}`}
                            left={props => <Image {...props} source={{ uri: item.poster as string }} style={{ width: 50, height: 75 }} />}
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
            <SearchBar />
            <List.Subheader>Movie List</List.Subheader>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <List.Item style={{ paddingHorizontal: 10 }}
                        key={item.id}
                        title={item.title}
                        description={`${item.year} | ${item.description}`}
                        left={props => <Image {...props} source={{ uri: item.poster as string }} style={{ width: 50, height: 75 }} />}
                        onPress={() => {
                            router.push(item.media_type + '/' + item.id)
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
        <List.Section>
            <SearchBar />
            <List.Subheader>Movie List</List.Subheader>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <List.Item style={{ paddingHorizontal: 10 }}
                        key={item.id}
                        title={item.title}
                        description={`${item.year} | ${item.description}`}
                        left={props => <Image {...props} source={{ uri: item.poster as string }} style={{ width: 50, height: 75 }} />}
                        onPress={() => {
                            router.push(item.media_type + '/' + item.id)
                        }}
                    />
                )}
            />
        </List.Section>
    </ScrollView>
    )

}