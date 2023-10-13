import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { fetchMovie } from '../../utils/db'
import Loading from '../../components/Loading'
import analytics from '@react-native-firebase/analytics'
import MediaDetail from '../../components/Shared/MediaDetail'
import { MovieMeta } from '../../types/meta/MediaMeta'

const MoviePage = () => {
    const { id } = useLocalSearchParams();
    const [movieData, setMovieData] = React.useState({} as MovieMeta)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetchMovie(id as string).then((res) => {
            setMovieData(res)
            setLoading(false)
            analytics().logScreenView({
                screen_name: res.title,
                screen_class: 'Movie'
            })
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
    return (
        <MediaDetail data={movieData} type='movie'/>
    )
}

export default MoviePage
