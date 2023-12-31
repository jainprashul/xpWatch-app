import { StyleSheet, View , FlatList} from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Card, Chip, Divider, Text } from 'react-native-paper'
import { router } from 'expo-router';
import { Cast, MovieDetail, RecommendationsResult } from '../types/movieDetail';
import { TVDetails } from '../types/tvDetails';
import { MaterialIcons } from '@expo/vector-icons';
import { POSTER_HEIGHT, POSTER_WIDTH } from './Shared/List';
import { Embed } from '../app/player';


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
                    return <Chip key={genre.id} mode='outlined' style={{ margin: 2 }}>{genre.name}</Chip>
                })}
            </View>
            <Text variant='bodySmall' style={{
                marginVertical: 10,
            }} >{result?.overview}</Text>
            {seasons}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                {/* <FlatList
                    horizontal
                    data={result?.videos.results ?? []}
                    renderItem={({ item }) => {
                        return <Card style={{ margin: 5, width: POSTER_HEIGHT }} onPress={() => {
            
                        }} >
                            <Embed source={`https://www.youtube.com/embed/${item.key}`} />
                            <Card.Content>

                                <Text variant='labelLarge' >{item.name}</Text>
                            </Card.Content>
                        </Card>
                    }}
                    keyExtractor={(item) => item.id.toString()}
                /> */}

            </View>

            <Text variant='labelLarge' >Cast</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <FlatList
                data={cast?.filter((item) => item.profile_path !== null) ?? []}
                renderItem={({ item }) => {
                    return <Card style={{ margin: 5, width: POSTER_WIDTH }} onPress={() => {
                        router.push('person/' + item.id)
                    }}>
                        <Card.Cover style={styles.poster} source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{item.name}</Text>
                            <Text variant='bodySmall' >{item.character}</Text>
                        </Card.Content>
                    </Card>
                }
                }
                keyExtractor={(item) => item.id.toString()}
                horizontal
            />
            

            <RecommandationView result={recommandations ?? []} text='Recommandations' />
            <RecommandationView result={similars ?? []} text='Similars' />

        </View>
    )
}

export default OverviewDetails

const styles = StyleSheet.create({
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
})

type SProps = {
    result: RecommendationsResult[],
    text: string
    size ?: number
}


export function RecommandationView({ result, text, size=POSTER_WIDTH }: SProps) {
    if (result.length === 0) return null
    return <>
        <Text variant='labelLarge' >{text}</Text>
        <Divider style={{ marginVertical: 6, }} bold />
            <FlatList
                data={result.sort((a, b) => b.vote_average - a.vote_average)}
                renderItem={({ item }) => {
                    return <Card style={{ margin: 5, width: size, }} onPress={() => {
                        router.push(item.media_type + "/" + item.id)
                    }} >
                        <Card.Cover style={styles.poster} source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }} />
                        <Card.Content>
                            <Text style={{marginTop : 4}} variant='labelLarge' ><MaterialIcons style={{ padding : 4 }} name={item.media_type as any} size={20} color={'white'} /> {item.title ?? item.name}</Text>
                        </Card.Content>
                    </Card>
                }}
                keyExtractor={(item) => item.id.toString()}
                horizontal
            />
    </>

}