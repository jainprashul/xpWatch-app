import { Share, StyleSheet, View } from 'react-native'
import { Stack } from 'expo-router'
import { Button,  Divider, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { MovieSrc, MovieX, getMovieData, getMovieSources } from '../../utils/db'

import { theme } from '../../style/theme'
import { router } from 'expo-router';
import Loading from '../../components/Loading'

import Overview from '../../components/Overview'
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { has, myListActions } from '../../store/context/myListSlice'

const MoviePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const [movieData, setMovieData] = React.useState({} as MovieX)
    const { cast, imdb, recommandations, result, similars } = movieData
    const [sources, setSources] = React.useState([] as MovieSrc)

    const favorite = useAppSelector(has('movie', id as string))
    const watched = useAppSelector(has('watchedAlready', id as string))

    const [loading, setLoading] = React.useState(true)

    function AddtoFavorite() {
        if(result)
        dispatch(myListActions.addMovie(result))
    }

    function RemoveFromFavorite() {
        if(result)
        dispatch(myListActions.removeMovie(result.id.toString()))
    }

    function AddtoWatched() {
        if(result)
        dispatch(myListActions.addWatchedAlready({
            ...result,
            type : 'movie'
        }))
    }

    function RemoveFromWatched() {
        if(result)
        dispatch(myListActions.removeWatchedAlready(result.id.toString()))
    }

    useEffect(() => {
        console.log(id)
        getMovieData(id as string).then((res) => {
            setMovieData(res)
            setLoading(false)
        })
    }, [id])

    useEffect(() => {
        const sources = getMovieSources(id as string, imdb)
        setSources(sources)
    }, [imdb, id])

    if (loading) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }

    return (
        <Overview cast={cast} recommandations={recommandations} result={result} similars={similars}>
            <View style={{ marginVertical: 10, overflow: 'hidden', flexDirection : 'row', justifyContent : "space-around" , alignItems : "center" }}>
            <Button mode="contained" style={{ marginVertical: 10, width: 250 }} onPress={() => {
                console.log(sources)
                router.push({
                    pathname: 'player',
                    params: {
                        type: 'movie',
                        sources: JSON.stringify(sources),
                        result : JSON.stringify(result),
                        recommandations : JSON.stringify(recommandations),
                    }
                })
            }} labelStyle={{
                color: 'white'
            }} >
                Watch Now
            </Button>
            <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={30} color={theme.colors.primary} onPress={()=>{
                favorite ? RemoveFromFavorite() : AddtoFavorite()
            }} />
            <MaterialIcons name={watched ? "bookmarks" : "bookmark-border"} size={30} color={theme.colors.primary} onPress={()=>{
                watched ? RemoveFromWatched() : AddtoWatched()
            }} />
            {/* SHARE  */}
            <MaterialIcons name="share" size={30} color={theme.colors.primary} onPress={()=>{
                Share.share({
                    message : `Watch ${result?.title} on xpWatch /n https://xpwatch.vercel.app/movie/${result?.id}`
                }, {
                    dialogTitle : `Share ${result?.title}`,
                    subject : `Watch ${result?.title} on xpWatch`
                })
            }} />

            </View>
            <Text variant='headlineMedium' >{result?.title}</Text>
            <Text variant='bodyLarge' >{result?.tagline}</Text>

            <Divider style={{ marginVertical: 6, }} bold />
            <Text variant='labelLarge' >{result?.release_date.toString() ?? ''} - {result?.runtime ?? 0} mins </Text>
            <Text variant='labelLarge' >{result?.vote_average ?? 0} / 10</Text>

        </Overview>
    )
}

export default MoviePage

const styles = StyleSheet.create({})