import { View, Pressable } from 'react-native'
import React from 'react'
import { Media } from '../../types/media'
import { Card, Divider, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { Anime } from '../../types/anime';
import { router } from 'expo-router';


type Props = {
    data: Array<Media | Anime>
    name?: string
}

const List = ({ data, name }: Props) => {
    return (
        <>
            <Text variant='labelLarge'>{name ?? "Trending"}</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <View style={{ flexDirection: 'row', marginVertical: 10, gap: 4, flexWrap: 'wrap' }}>
                {data.map((movie) =>
                    !isAnime(movie) ? <ItemView key={movie.id} item={movie as Media} /> : <AnimeItemView key={movie.id} item={movie as Anime} />
                )}
            </View>
        </>
    )
}

export default List



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
            <Card style={{ margin: 2, width: "48%" }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w342${poster_path}` }} />
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
            <Card style={{ margin: 2, width: "48%" }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover source={{ uri: coverImage ?? bannerImage }} />
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

function isAnime(item: Media | Anime): item is Anime {
    return (item as Anime).slug !== undefined;
}