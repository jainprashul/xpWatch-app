import { StyleSheet, View, FlatList } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { myListActions, selectWatchHistory } from '../store/context/myListSlice'
import { Card, Divider, Text } from 'react-native-paper'
import { router } from 'expo-router'

const ContinueWatching = () => {
    const data = useAppSelector(selectWatchHistory)
    const dispatch = useAppDispatch()
    if (data.length === 0) return null
    return (
        <View>
            <Text>Continue Watching</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return <Card style={{ margin: 5, width: 180 }} onPress={() => {
                        router.push(item.type + '/' + item.id)
                    }}
                        onLongPress={() => {
                            // dispatch(removeFromMyList(item))
                            console.log('remove')
                            dispatch(myListActions.removeWatchHistory(item.slug ?? item.id))
                        }}
                    >
                        <Card.Cover style={styles.poster} source={{ uri: item.coverImage ?? `https://image.tmdb.org/t/p/w500${item.poster_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{item.title?.english ?? item.title ?? item.name}</Text>
                            {/* <Text variant='bodySmall' >{item.overview ?? }</Text> */}
                        </Card.Content>
                    </Card>
                }}

                keyExtractor={(item) => item.id.toString()}
                horizontal
            />
        </View>
    )
}

export default ContinueWatching

const styles = StyleSheet.create({
    poster: {
        height: 270,
        aspectRatio: 2 / 3,
    }
})