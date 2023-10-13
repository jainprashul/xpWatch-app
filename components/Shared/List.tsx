import { View, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { Card, Divider, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Loading from '../Loading';
import { theme } from '../../style/theme';
import { MediaMini } from '../../types/meta/MediaMeta';

export const POSTER_WIDTH = 180
export const POSTER_HEIGHT = 270

export const styles = StyleSheet.create({
    poster: {
        aspectRatio: 2 / 3,
        height: POSTER_HEIGHT,
    }
})


type Props = {
    data: MediaMini[];
    name?: string
    horizontal?: boolean
    link?: string
}

    const List = ({ data, name, horizontal, link }: Props) => {
    if (data?.length === 0) return null;
    const _data = useMemo(() => data.filter(m => m.poster), [data])
    if (horizontal) return <HorizontalList data={_data} name={name} link={link} />
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{
                    marginTop: 6,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontVariant: ['small-caps']
                }} >{name ?? "Trending"}</Text>
                {
                    link ? <Pressable onPress={() => router.push(link)}>
                        <Text style={{ color: theme.colors.primary }}>See All</Text>
                    </Pressable> : null
                }
            </View>
            <Divider style={{ marginVertical: 6, }} bold />
            <FlatList data={_data} renderItem={({ item }) => <ItemView key={item.id} item={item} />}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => <Loading />}
            />

        </>
    )
}

export default List

function HorizontalList({ data, name, link }: Props) {
    if (data?.length === 0) return null;
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{
                    marginTop: 6,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontVariant: ['small-caps']
                }} >{name ?? "Trending"}</Text>
                {
                    link ? <Pressable onPress={() => router.push(link)}>
                        <Text style={{ color: theme.colors.primary }}>See All</Text>
                    </Pressable> : null
                }
            </View>
            <Divider style={{ marginVertical: 6, }} bold />
            <FlatList data={data} renderItem={({ item }) => <ItemView item={item} />}
                keyExtractor={(item) => item.id.toString()} horizontal
                decelerationRate="fast"
                snapToInterval={POSTER_WIDTH + 10}

            />
        </>
    )
}

function ItemView({ item }: { item: MediaMini }) {
    const { title, media_type, id, poster, year } = item
    function _onPress() {
        console.log(id, title ?? name ?? '' , media_type)
        if (media_type === 'movie') {
            router.push('movie/' + id)
        } else if (media_type === 'tv') {
            router.push('tv/' + id)
        } else if (media_type === 'anime') {
            router.push('anime/' + id)
        } else if (media_type === 'anilist') {
            router.push('anilist/' + id)
        }
    }

    return (
        // Flat List Item
        <>
            <Card style={{ margin: 5, flex: 1, width: POSTER_WIDTH }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover style={styles.poster} source={{ uri: poster as string }} />
                </Pressable>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>
                                <MaterialIcons name={media_type === 'anilist' ? "20mp" : media_type as any} size={20} color={'white'} />
                                <Text>  {title} </Text>
                            </View>
                            <Text>{year}</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </>

    );
}

