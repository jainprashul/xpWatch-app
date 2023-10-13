import { Dimensions, Image, ImageBackground, StyleSheet, View, FlatList, TouchableOpacity, Share } from 'react-native'
import React, { useEffect, useMemo, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Stack, useLocalSearchParams } from 'expo-router'
import { theme } from '../../style/theme'
import { AnilistX, AnimeX, getAniEpisodeSources, getAnilistDetails, getAnimeData, getEpisodeSources } from '../../utils/db'
import Loading from '../../components/Loading'
import { ActivityIndicator, Button, Card, Chip, Divider, List, Surface, Text } from 'react-native-paper'
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';


import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { has, myListActions, selectHistoryByID } from '../../store/context/myListSlice'
import { animeActions } from '../../store/context/animeSlice'
import Ratings from '../../components/Ratings'
import { POSTER_HEIGHT, POSTER_WIDTH } from '../../components/Shared/List'


const AniListDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams()
    const { width, height } = Dimensions.get('window')

    const favorite = useAppSelector(has('anime', id as string))
    const history = useAppSelector(selectHistoryByID(id as string))
    const watched = useAppSelector(has('watchedAlready', id as string))

    const [loading1, setLoading1] = React.useState(false)

    useEffect(() => {
        if (history) {
            dispatch(animeActions.setEpisode(history.e))
        } else {
            dispatch(animeActions.setEpisode(1))
        }
    }, [history])

    const [data, setData] = React.useState({} as AnilistX)
    const { episodes, result, similars, recommandations } = data

    const [sort, setSort] = React.useState(1)

    const [loading, setLoading] = React.useState(true)


    const episode = useAppSelector(state => state.anime.current.episode)
    const setEpisode = (e: number) => {
        dispatch(animeActions.setEpisode(e))
    }

    useEffect(() => {
        console.log(id)
        getAnilistDetails(id as string).then((res) => {
            setData(res)
            dispatch(animeActions.setEpisodeList(JSON.parse(JSON.stringify(res.episodes))))
            setLoading(false)
            analytics().logScreenView({
                screen_name: res?.result.title.english ?? 'Anime',
                screen_class: 'Anime'
            });
        })
    }, [id])


    if (loading) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }

    const play = (id: string) => {

        console.log(id)
        setLoading1(true)
        getAniEpisodeSources(id).then((res) => {
            setLoading1(false)
            console.log( "TRE", res)
            router.push({
                pathname: 'player',
                params: {
                    type: 'anilist',
                    sources: JSON.stringify(res),
                    result: JSON.stringify(result),
                }
            })
        })
    }

    function AddtoFavorite() {
        if (result)
            dispatch(myListActions.addAnime(result))
        analytics().logEvent('add_to_favorite', {
            content_type: 'anime',
            item_id: result?.id,
            title: result?.title
        });
    }

    function RemoveFromFavorite() {
        if (result)
            dispatch(myListActions.removeAnime(result.id.toString()))
        analytics().logEvent('remove_from_favorite', {
            content_type: 'anime',
            item_id: result?.id,
            title: result?.title
        });

    }

    function AddtoWatched() {
        if (result)
            dispatch(myListActions.addWatchedAlready({
                ...result,
                type: 'anime'
            }))
        analytics().logEvent('add_to_watched', {
            content_type: 'anime',
            item_id: result?.id,
            title: result?.title
        });
    }

    function RemoveFromWatched() {
        if (result)
            dispatch(myListActions.removeWatchedAlready(result.id.toString()))
        analytics().logEvent('remove_from_watched', {
            content_type: 'anime',
            item_id: result?.id,
            title: result?.title
        });
    }


    const SeasonBox = () => <>
        <View style={{
            marginTop: 10,
        }}>

            <List.Section>
                <List.Accordion expanded
                    onPress={() => {
                        setSort(-sort)
                    }}
                    right={() => <Text>
                        Sort {sort === 1 ? 'ASC' : 'DESC'}
                    </Text>}
                    title={`${episodes?.length} Episodes`}>

                    <FlatList
                        data={episodes?.sort((a, b) => sort * (a.number - b.number))}
                    
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.number}. ${v.title ?? "Episode " + v.number}`}
                            description={v.description}
                            onPress={() => {
                                setEpisode(v.number)
                                setTimeout(() => {
                                    play(v.id)
                                }, 200);
                            }}
                            left={props => <Image {...props} source={{ uri: v.image }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)
                        }
                    />
                </List.Accordion>
            </List.Section>

        </View></>

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <ImageBackground source={{ uri: result.image }} style={{
                width: width,
                height: height - 110,
            }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "rgba(0,0,0,.6)", padding: 10 }}>
                    <Image source={{ uri: result.image }} style={{ width: 200, height: 300, resizeMode: 'cover', borderRadius: 5, }} />

                    <View style={{ marginVertical: 10, overflow: 'hidden', flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>

                        <Button mode="contained" style={{ marginVertical: 10, width: 250 }} onPress={() => {
                            play(episodes?.[episode - 1]?.id!)
                        }} labelStyle={{
                            color: 'white'
                        }}>
                            <ActivityIndicator animating={loading1} color='white' />
                            Watch Now - E{episode}
                        </Button>
                        <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={30} color={theme.colors.primary} onPress={() => {
                            favorite ? RemoveFromFavorite() : AddtoFavorite()
                        }} />
                        <MaterialIcons name={watched ? "bookmarks" : "bookmark-border"} size={30} color={theme.colors.primary} onPress={() => {
                            watched ? RemoveFromWatched() : AddtoWatched()
                        }} />
                        {/* <MaterialIcons name="share" size={30} color={theme.colors.primary} onPress={() => {
                            Share.share({
                                message: `Watch ${result?.title} on xpWatch /n https://xpwatch.vercel.app/anmex/${result?.slug}`
                            }, {
                                dialogTitle: `Share ${result?.title}`,
                                subject: `Watch ${result?.title} on xpWatch`
                            })
                        }} /> */}
                    </View>

                    <Text variant='headlineMedium' >{result?.title.english}</Text>
                    <Text variant='bodyLarge' >{result?.title.userPreferred}</Text>

                    <Divider style={{ marginVertical: 6 }} bold />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Text variant='labelLarge'>{result.releaseDate} </Text>
                        <Text variant='labelLarge'>{result.season}</Text>
                        <Text variant='labelLarge'>{episodes?.length} Episodes</Text>
                        <Text variant='labelLarge'>{result?.duration} min</Text>
                    </View>

                    <Ratings ratings={result?.rating / 10 ?? 0} />
                </View>

            </ImageBackground>

            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                    {result?.genres?.map((genre) => {
                        return <Chip mode='outlined' style={{ margin: 2 }}>{genre}</Chip>
                    })}
                </View>
                <Text variant='bodySmall' >{result?.description}</Text>


                <SeasonBox />

                {Boolean(similars?.length) && <><Text variant='labelLarge' >Similar</Text>
                    <Divider style={{ marginVertical: 6, }} bold /></>}
                <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                    {similars?.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map((movie) => {
                        return <Card style={{ margin: 5, width: POSTER_WIDTH, }} onPress={() => {
                            router.push('anilist/' + movie.id)
                        }} >
                            <Card.Cover style={styles.poster} source={{ uri: movie.image }} />
                            <Card.Content>
                                <Text variant='bodySmall' >{movie.title.english ?? movie.title.userPreferred}</Text>
                                <Text variant='bodySmall' >{movie.relationType}</Text>
                            </Card.Content>
                        </Card>
                    }
                    )}
                </ScrollView>
                {Boolean(recommandations?.length) && <><Text variant='labelLarge' >Recommandations</Text>
                    <Divider style={{ marginVertical: 6, }} bold /></>}
                <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                    {recommandations?.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).map((movie) => {
                        return <Card style={{ margin: 5, width: POSTER_WIDTH, }} onPress={() => {
                            router.push('anilist/' + movie.id)
                        }} >
                            <Card.Cover style={styles.poster} source={{ uri: movie.image }} />
                            <Card.Content>
                                <Text variant='bodySmall' >{movie.title.english ?? movie.title.userPreferred}</Text>
                                <Text variant='bodySmall' >{movie.type}</Text>
                            </Card.Content>
                        </Card>
                    }
                    )}
                </ScrollView>

            </View>

        </ScrollView>
    )
}

export default AniListDetail

const styles = StyleSheet.create({
    select: {
        borderBottomColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        marginBottom: 20,
    },
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
})