import { View, Pressable, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Media } from '../../types/media'
import { Card, Divider, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { Anime } from '../../types/anime';
import { router } from 'expo-router';
import Loading from '../Loading';
import { theme } from '../../style/theme';
import { AniList } from '../../types/anilist';

export const POSTER_WIDTH = 180
export const POSTER_HEIGHT = 270

export const styles = StyleSheet.create({
    poster: {
        aspectRatio: 2 / 3,
        height: POSTER_HEIGHT,
    }
})


type Props = {
    data: Array<Media | Anime | AniList>
    name?: string
    horizontal?: boolean
    link?: string
}

const List = ({ data, name, horizontal, link }: Props) => {
    if (data?.length === 0) return null;
    if (horizontal) return <HorizontalList data={data} name={name} link={link} />
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
            <FlatList data={data} renderItem={({ item }) => {
                return !isAniList(item as any) ? <ItemView item={item as Media} /> : <AniListItemView item={item as AniList} />
            }}
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
            <FlatList data={data} renderItem={({ item }) => {
                return !isAniList(item as any) ? <ItemView item={item as Media} /> : <AniListItemView item={item as AniList} />
            }} keyExtractor={(item) => item.id.toString()} horizontal
                decelerationRate="fast"
                snapToInterval={POSTER_WIDTH + 10}

            />
        </>
    )
}



function ItemView({ item }: { item: Media }) {
    const { title, name, poster_path, media_type, release_date, first_air_date, id } = item
    function _onPress() {
        console.log(id, title ?? name ?? '')
        if (media_type === 'movie') {
            router.push('movie/' + id)
        } else if (media_type === 'tv') {
            router.push('tv/' + id)
        }
    }

    return (
        // Flat List Item
        <>
            <Card style={{ margin: 5, flex: 1, width: POSTER_WIDTH }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover style={styles.poster} source={{ uri: `https://image.tmdb.org/t/p/w342${poster_path}` }} />
                </Pressable>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>
                                <MaterialIcons name={media_type} size={20} color={'white'} />
                                <Text>  {title ?? name ?? ''} </Text>
                            </View>
                            <Text>{getYear(release_date ?? first_air_date)}</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </>

    );
}

function AnimeItemView({ item }: { item: Anime }) {
    const { id, title, year, bannerImage, coverImage, slug, currentEpisode } = item

    function _onPress() {
        console.log(id, title.userPreferred)
        router.push('anime/' + slug)
    }

    return (
        <>
            <Card style={{ margin: 5, flex: 1, width: POSTER_WIDTH }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover style={styles.poster} source={{ uri: coverImage ?? bannerImage }} />
                </Pressable>

                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>

                                <Text>{title.english ?? title.userPreferred} </Text>
                            </View>
                            <Text>{year} ({currentEpisode})</Text>
                        </View>

                    </View>
                </Card.Content>
            </Card>
        </>
    );
}

function AniListItemView({ item }: { item: AniList }) {
    const { id, title, releaseDate: year, image: bannerImage,  totalEpisodes: currentEpisode } = item

    function _onPress() {
        console.log(id, title.userPreferred)
        router.push('anilist/' + id)
    }

    return (
        <>
            <Card style={{ margin: 5, flex: 1, width: POSTER_WIDTH }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover style={styles.poster} source={{ uri: bannerImage ?? bannerImage}} />
                </Pressable>

                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>

                                <Text>{title.english ?? title.userPreferred} </Text>
                            </View>
                            <Text>{year} ({currentEpisode})</Text>
                        </View>

                    </View>
                </Card.Content>
            </Card>
        </>
    );
}


export function getYear(date: Date | undefined) {
    if (!date) return ''
    return new Date(date).getFullYear() ?? ''
}

export function isAnime(item: Media | Anime): item is Anime {
    return (item as Anime).slug !== undefined;
}

export function isAniList(item: Media | AniList): item is AniList {
    return (item as AniList).media_type === 'anime'
}