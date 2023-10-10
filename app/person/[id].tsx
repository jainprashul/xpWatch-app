import { StyleSheet, ImageBackground, View, Dimensions } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { theme } from '../../style/theme'
import { p } from '../../utils/constants'
import { PersonDetail } from '../../types/personDetail'
import { Card, Divider, Text } from 'react-native-paper'
import Loading from '../../components/Loading'
import analytics from '@react-native-firebase/analytics'
import { POSTER_HEIGHT, POSTER_WIDTH } from '../../components/Shared/List'

const PersonPage = () => {
    const { id } = useLocalSearchParams()
    const [data, setData] = React.useState({} as PersonDetail)

    const [loading, setLoading] = React.useState(true)


    React.useEffect(() => {
        console.log(id, p(id as string))
        fetch(p(id as string)).then((res) => res.json()).then((res) => {
            setData(res)
            setLoading(false)
            analytics().logScreenView({
                screen_name: res.name ?? 'Person',
                screen_class: 'Person'
            })
        })

    }, [id])

    const { width, height } = Dimensions.get('window')

    if (loading) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }
    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <ImageBackground source={{ uri: `https://image.tmdb.org/t/p/w780${data?.profile_path}` }} style={{
                width: '100%',
                height: height - 110,

            }}>
            </ImageBackground>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{data?.name}</Text>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{data?.also_known_as}</Text>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{data?.birthday}</Text>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{data?.place_of_birth}</Text>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{data?.biography}</Text>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Movies</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                <MediaList data={data?.credits?.cast ?? []} text='Known For' />
                <MediaList data={data?.movie_credits?.cast ?? []} text='Movies' />
                <MediaList data={data?.tv_credits?.cast ?? []} text='TV Shows' type='tv' />
            </View>

        </ScrollView>
    )
}

export default PersonPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10,
    },
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
})

function MediaList({ data, text, type='movie' }: { data: any[], text: string, type?: string }) {
    return <View >
        <Text variant='labelLarge' >{text}</Text>
        <Divider style={{ marginVertical: 6, }} bold />
        <FlatList
            data={data.sort((a, b) => b.vote_average - a.vote_average)}
            renderItem={({ item }) => {
                return <Card style={{ margin: 5, width: POSTER_WIDTH, }} onPress={() => {
                    router.push(type + "/" + item.id)
                }} >
                    <Card.Cover style={styles.poster} source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }} />
                    <Card.Content>

                        <Text style={{ marginTop: 4 }} variant='labelLarge' >{item.title}</Text>
                    </Card.Content>
                </Card>
            }}
            keyExtractor={(item) => item.id.toString()}
            horizontal
        />
    </View>
}