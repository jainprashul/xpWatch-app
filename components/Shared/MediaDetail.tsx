import { StyleSheet, Dimensions, ImageBackground, Image, View, Share } from 'react-native'
import React from 'react'
import { theme } from '../../style/theme'
import { MovieMeta, TVMeta } from '../../types/meta/MediaMeta'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Stack, router } from 'expo-router'
import { Button, Card, Chip, Divider, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { has, myListActions } from '../../store/context/myListSlice'
import { MediaMeta_to_MediaMini, WATCHED_ALREADY } from '../../utils/converter'
import analytics from '@react-native-firebase/analytics'
import Ratings from '../Ratings'
import List, { POSTER_HEIGHT, POSTER_WIDTH } from './List'


type Props = {
    data: MovieMeta | TVMeta
    type: "movie" | "tv" | "anime" | "anilist"
    children?: React.ReactNode
}

const MediaDetail = ({ data: result, type, children }: Props) => {
    const { width, height } = Dimensions.get('window')
    const dispatch = useAppDispatch()

    const favorite = useAppSelector(has(type === "anilist" ? "anime" : type, result.id))
    const watched = useAppSelector(has(WATCHED_ALREADY, result.id))


    function AddtoFavorite() {
        if (result)
            dispatch(myListActions.addMedia(MediaMeta_to_MediaMini(result)))
        analytics().logEvent('add_to_favorite', {
            content_type: type,
            item_id: result.id,
            title: result.title
        });
    }

    function RemoveFromFavorite() {
        if (result)
            dispatch(myListActions.removeMedia({
                id: result.id.toString(),
                media_type: type,
            }))
        analytics().logEvent('remove_from_favorite', {
            content_type: type,
            item_id: result.id,
            title: result.title
        });
    }

    function AddtoWatched() {
        if (result)
            dispatch(myListActions.addWatchedAlready(MediaMeta_to_MediaMini(result)))
        analytics().logEvent('add_to_watched', {
            content_type: type,
            item_id: result?.id,
            title: result?.title
        });
    }

    function RemoveFromWatched() {
        if (result)
            dispatch(myListActions.removeWatchedAlready(result.id.toString()))
        analytics().logEvent('remove_from_watched', {
            content_type: type,
            item_id: result?.id,
            title: result?.title
        });
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />

            <ImageBackground source={{ uri: result.cover }} style={{
                width: width,
                height: height - 110,
            }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "rgba(0,0,0,.6)", padding: 10 }}>
                    <Image source={{ uri: result.poster! }} style={{ width: 200, height: 300, resizeMode: 'cover', borderRadius: 5, }} />

                    <View style={{ marginVertical: 10, overflow: 'hidden', flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>
                        <Button mode="contained" style={{ marginVertical: 10, width: 250 }} onPress={() => {
                            router.push({
                                pathname: 'player',
                                params: {
                                    type: type,
                                    result: JSON.stringify(result),
                                }
                            })
                        }} labelStyle={{
                            color: 'white'
                        }} >
                            Watch Now
                        </Button>
                        <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={30} color={theme.colors.primary} onPress={() => {
                            favorite ? RemoveFromFavorite() : AddtoFavorite()
                        }} />
                        <MaterialIcons name={watched ? "bookmarks" : "bookmark-border"} size={30} color={theme.colors.primary} onPress={() => {
                            watched ? RemoveFromWatched() : AddtoWatched()
                        }} />
                        {/* SHARE  */}
                        <MaterialIcons name="share" size={30} color={theme.colors.primary} onPress={() => {
                            Share.share({
                                message: `Watch ${result?.title} on xpWatch /n https://xpwatch.vercel.app/${type}/${result?.id}`
                            }, {
                                dialogTitle: `Share ${result?.title}`,
                                subject: `Watch ${result?.title} on xpWatch`
                            })
                            analytics().logEvent('share', {
                                content_type: type,
                                item_id: result?.id,
                                title: result?.title
                            });
                        }} />
                    </View>

                    <Text variant='headlineMedium' >{result.title}</Text>
                    <Text variant='bodyLarge' >{result?.tagline}</Text>
                    <Divider style={{ marginVertical: 6, }} bold />
                    {
                        type === "movie" ?
                            <Text variant='labelLarge' >{(result as MovieMeta).releaseDate} - {(result as MovieMeta).runtime} mins </Text>
                            : null
                    }
                    <Ratings ratings={result.ratings} />
                </View>
            </ImageBackground>


            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                    {result?.genres?.map((genre) => {
                        return <Chip key={genre.id} mode='outlined' style={{ margin: 2 }}>{genre.name}</Chip>
                    })}
                </View>
                <Text variant='bodySmall' style={{
                    marginVertical: 10,
                }} >{result.description}</Text>


                <Text variant='labelLarge' >Cast</Text>
                <Divider style={{ marginVertical: 6, }} bold />
                <FlatList
                    data={result.casts}
                    renderItem={({ item }) => {
                        return <Card style={{ margin: 5, width: POSTER_WIDTH }} onPress={() => {
                            router.push('person/' + item.id)
                        }}>
                            <Card.Cover style={styles.poster} source={{ uri: item.image }} />
                            <Card.Content>
                                <Text variant='labelLarge' >{item.name}</Text>
                                <Text variant='bodySmall' >{item.character}</Text>
                            </Card.Content>
                        </Card>
                    }
                    }
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                />
                <List data={result.recommendations ?? []} name='Recommandations' horizontal />
                <List data={result.similar ?? []} name='Similars' horizontal />
            </View>
        </ScrollView>
    )
}

export default MediaDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
});


function isTVMeta(arg: MovieMeta | TVMeta): arg is TVMeta {
    return arg.media_type === "tv";
}