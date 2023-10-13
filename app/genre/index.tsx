import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { theme } from '../../style/theme'
import { genre } from '../../utils/constants'
import List from '../../components/Shared/List'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, SegmentedButtons } from 'react-native-paper'
import { fetchMoviesFromGenre, fetchTVFromGenre } from '../../utils/db'
import { MediaMini } from '../../types/meta/MediaMeta'

const GenreList = () => {
    const { id, name } = useLocalSearchParams()

    const [movies, setMovies] = React.useState<MediaMini[]>([])
    const [tv, setTv] = React.useState<MediaMini[]>([])

    const [select, setSelect] = React.useState("movie")
    const [page, setPage] = React.useState(1)

    React.useEffect(() => {
        fetchTVFromGenre(id as string, page).then(res => {
            setTv((prev) => [...prev, ...res])
        })
        fetchMoviesFromGenre(id as string, page).then(res => {
            setMovies((prev) => [...prev, ...res])
        })
    }, [id, page])

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                title: name as string,
            }} />

            <SegmentedButtons
                density='small'
                value={select}
                onValueChange={(value) => {
                    setSelect(value)
                }}
                buttons={['movie', 'tv'].map((src) => {
                    return { label: src.toLocaleUpperCase(), value: src }
                })}
            />

            <List data={select === 'movie' ? movies : tv} name={
                select === 'movie' ? 'Movies' : 'TV Shows'
            } />

            <View style={{
                justifyContent : "flex-end",
                marginBottom : 20
            }}>
                <Button  onPress={() => {
                    setPage((prev) => prev + 1)
                }}>More</Button>
            </View>

        </ScrollView>
    )
}

export default GenreList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10
    },
})