import { StyleSheet, View, FlatList } from 'react-native'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { myListActions, selectWatchHistory } from '../store/context/myListSlice'
import { Card, Divider, Text } from 'react-native-paper'
import { router } from 'expo-router'
import List, { POSTER_HEIGHT, POSTER_WIDTH } from './Shared/List'

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
                    return <Card style={{ margin: 5, width: POSTER_WIDTH }} onPress={() => {
                        router.push(item.media_type + '/' + item.id)
                    }}
                        onLongPress={() => {
                            // dispatch(removeFromMyList(item))
                            console.log('remove')
                            dispatch(myListActions.removeWatchHistory(item.id))
                        }}
                    >
                        <Card.Cover style={styles.poster} source={{ uri: item.poster! }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{item.title}</Text>
                            <Text variant='bodySmall' >{item.year}</Text>
                        </Card.Content>
                    </Card>
                }}

                keyExtractor={(item) => item.id}
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