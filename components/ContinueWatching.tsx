import { StyleSheet, View, FlatList } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { myListActions, selectWatchHistory } from '../store/context/myListSlice'
import { Card, Divider, Text } from 'react-native-paper'
import { router } from 'expo-router'
import { POSTER_HEIGHT, POSTER_WIDTH } from './Shared/List'

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
                    console.log("itemx",item.type)
                    return <Card style={{ margin: 5, width: POSTER_WIDTH }} onPress={() => {
                        router.push(item.type + '/' + item.id)
                    }}
                        onLongPress={() => {
                            // dispatch(removeFromMyList(item))
                            console.log('remove')
                            dispatch(myListActions.removeWatchHistory(item.slug ?? item.id))
                        }}
                    >
                        <Card.Cover style={styles.poster} source={{ uri: item.coverImage ?? item.image ?? `https://image.tmdb.org/t/p/w500${item.poster_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{item.title?.english ?? item.title ?? item.name}</Text>
                            {/* <Text variant='bodySmall' >{item.overview ?? }</Text> */}
                        </Card.Content>
                    </Card>
                }}

                keyExtractor={(item) => item.id.toString()}
                horizontal
                decelerationRate="fast"
                snapToInterval={POSTER_WIDTH + 10}
            />
        </View>
    )
}

export default ContinueWatching

const styles = StyleSheet.create({
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
})