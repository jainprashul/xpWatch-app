import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { BottomNavigation, List, Text } from 'react-native-paper'
import { selectAnime, selectLastWatched, selectMovie, selectTV, selectWatchedAlready } from '../../store/context/myListSlice';
import { ScrollView } from 'react-native-gesture-handler';
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

function MovieList() {
    const data = useAppSelector(selectMovie)

    return (
        <ScrollView>
            <List.Section>
                <List.Subheader>Movie List</List.Subheader>
                {data.map((movie) => {
                    return (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={movie.id}
                            title={movie.title}
                            description={movie.overview}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }} style={{ width: 50, height: 50 }} />}
                            onPress={() => {
                                router.push('movie/' + movie.id)
                            }}
                        />
                    )
                }
                )}
            </List.Section>
        </ScrollView>
    )
}

function TvList() {
    const data = useAppSelector(selectTV)

    return (
        <ScrollView>
            <List.Section>
                <List.Subheader>TV List</List.Subheader>
                {data.map((tv) => {
                    return (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={tv.id}
                            title={tv.name}
                            description={tv.overview}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w342${tv.poster_path}` }} style={{ width: 50, height: 50 }} />}
                        //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push('tv/' + tv.id)
                            }}
                        />
                    )
                }
                )}
            </List.Section>
        </ScrollView>
    )
}

function AnimeList() {
    const data = useAppSelector(selectAnime)

    return (
        <ScrollView>
            <List.Section>
                <List.Subheader>Anime List</List.Subheader>
                {data.map((anime) => {
                    return (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={anime.id}
                            title={anime.title.english ?? anime.title.userPreferred}
                            description={anime.description}
                            left={props => <Image {...props} source={{ uri: `${anime.coverImage}` }} style={{ width: 50, height: 50 }} />}
                        //   right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                router.push('anime/' + anime.id)
                            }}
                        />
                    )
                }
                )}
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
                {data.map((movie) => {
                    return (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={movie.id}
                            title={movie.title?.english ??  movie.title ?? movie.name}
                            description={movie.overview ?? movie.description}
                            left={props => <Image {...props} source={{ uri: movie.coverImage ??  `https://image.tmdb.org/t/p/w342${movie.poster_path}` }} style={{ width: 50, height: 50 }} />}
                            // right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                console.log(movie)
                                router.push(movie.type + '/' + movie.id)
                            }}
                        />
                    )
                }
                )}
            </List.Section>
        </ScrollView>
    )
}

function Recents() {
    const data = useAppSelector(selectLastWatched)

    return (
        <ScrollView>
            {/* <Text> {JSON.stringify(data)} </Text> */}
            <List.Section>
                <List.Subheader>Watched Already List</List.Subheader>
                {data.map((movie : any) => {
                    return (
                        <List.Item style={{ paddingHorizontal: 10 }}
                            key={movie.id}
                            title={movie.title?.english ??  movie.title ?? movie.name}
                            description={movie.overview ?? movie.description}
                            left={props => <Image {...props} source={{ uri: movie.coverImage ??  `https://image.tmdb.org/t/p/w342${movie.poster_path}` }} style={{ width: 50, height: 50 }} />}
                            // right={props => <List.Icon {...props} icon="dots-vertical" />}
                            onPress={() => {
                                console.log(movie)
                                router.push(movie.type + '/' + movie.id)
                            }}
                        />
                    )
                }
                )}
            </List.Section>
        </ScrollView>
    )

}

