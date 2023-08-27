import { StyleSheet, RefreshControl, ToastAndroid, View } from 'react-native'
import React, { useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import List from '../../components/Shared/List'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { theme } from '../../style/theme'
import { fetchMovies } from '../../store/context/homeSlice'
import Loading from '../../components/Loading'
import Slider from '../../components/Shared/Slider'

const Movie = () => {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = React.useState(true)

    const trending = useAppSelector(state => state.home.trending.movies)
    const data = useAppSelector(state => state.home.movies)

    useEffect(() => {
        if (Date.now() - (data?.lastRefreshed ?? 0) > 1000 * 60 * 60 * 24) {
            // 24 hours
            dispatch(fetchMovies(1)).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setLoading(false)
                }
            })
        } else {
            setLoading(false)
        }
    }, []);
    const [refreshing, setRefreshing] = React.useState(false);

    async function onRefresh() {
        setRefreshing(true);
        try {
            const res = await dispatch(fetchMovies(1))
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

    if (loading) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }


    return (
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <Stack.Screen options={{
                headerShown: true,
                title: `Movies`,
            }} />
            <Slider data={trending.slice(0, 10)} />
            <View style={{
                flex: 1,
                padding: 10,
            }}>
                <List data={trending as any[]} name='Trending' horizontal />
                <List data={data.popular as any[]} name='Popular' horizontal />
                <List data={data.topRated as any[]} name='Top Rated' horizontal />
                {
                    data.genres.map((item) => {
                        return <List data={item.results as any[]} name={item.name} horizontal />
                    })
                }
            </View>

        </ScrollView>
    )
}

export default Movie

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    }

})