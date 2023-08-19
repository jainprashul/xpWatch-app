import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Card, Chip, Divider, Text } from 'react-native-paper'
import { router } from 'expo-router';
import { Cast, MovieDetail, RecommendationsResult } from '../types/movieDetail';
import { TVDetails } from '../types/tvDetails';
import { MaterialIcons } from '@expo/vector-icons';


type Props = {
    result: MovieDetail | TVDetails | undefined,
    cast: Cast[] | undefined,
    recommandations: RecommendationsResult[] | undefined,
    similars: RecommendationsResult[] | undefined,
    seasons ?: React.ReactNode
}

const OverviewDetails = ({ result, cast, recommandations, similars , seasons}: Props) => {
    return (
        <View style={{ padding: 10 }}>


            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                {result?.genres?.map((genre) => {
                    return <Chip mode='outlined' style={{ margin: 2 }}>{genre.name}</Chip>
                })}
            </View>
            <Text variant='bodySmall' style={{
                marginVertical: 10,
            }} >{result?.overview}</Text>
            {seasons}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}></View>
            <Text variant='labelLarge' >Cast</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                {cast?.map((actor) => {
                    return <Card style={{ margin: 5, width: 180 }} onPress={() => {

                    }}>
                        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{actor.name}</Text>
                            <Text variant='bodySmall' >{actor.character}</Text>
                        </Card.Content>
                    </Card>
                })}
            </ScrollView>

            <RecommandationView result={recommandations ?? []} text='Recommandations' />
            <RecommandationView result={similars ?? []} text='Similars' />

        </View>
    )
}

export default OverviewDetails

const styles = StyleSheet.create({})

type SProps = {
    result: RecommendationsResult[],
    text: string
    size ?: number
}


export function RecommandationView({ result, text, size=180 }: SProps) {
    if (result.length === 0) return null
    return <>
        <Text variant='labelLarge' >{text}</Text>
        <Divider style={{ marginVertical: 6, }} bold />
        <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
            {result?.sort((a, b) => b.vote_average - a.vote_average).map((movie) => {
                return <Card key={movie.id} style={{ margin: 5, width: size, }} onPress={() => {
                    router.push(movie.media_type + "/" + movie.id)
                }} >
                    <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }} />
                    <Card.Content>

                        <Text style={{marginTop : 4}} variant='labelLarge' ><MaterialIcons style={{ padding : 4 }} name={movie.media_type} size={20} color={'white'} /> {movie.title ?? movie.name}</Text>
                    </Card.Content>
                </Card>
            }
            )}
        </ScrollView>
    </>

}