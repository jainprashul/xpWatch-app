import { Dimensions, Image, ImageBackground, StyleSheet, View, FlatList } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Stack, useLocalSearchParams } from 'expo-router'
import { theme } from '../../style/theme'
import { AnimeX, getAnimeData, getEpisodeSources } from '../../utils/db'
import Loading from '../../components/Loading'
import { Button, Card, Chip, Divider, List, Surface, Text } from 'react-native-paper'
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';


import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { has, myListActions } from '../../store/context/myListSlice'


const AnimeDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams()
    const { width, height } = Dimensions.get('window')

    const [data, setData] = React.useState({} as AnimeX)
    const { episodes, result, similars } = data

    const [loading, setLoading] = React.useState(true)


    const [episode, setEpisode] = React.useState(1)
    const favorite = useAppSelector(has('anime', id as string))


    const source = useMemo(() => {
        const ep = episodes?.find((v) => v.number === episode)
        console.log(ep?.sources)
        return ep?.sources
    }, [episode, episodes])


    useEffect(() => {
        console.log(id)
        getAnimeData(id as string).then((res) => {
            setData(res)
            setLoading(false)
        })
    }, [id])


    if (loading) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }

    const play = (sources: any[]) => {
        console.log("souces", sources)
        getEpisodeSources(sources).then((res) => {
            console.log(res)
            router.push({
                pathname: 'player',
                params: {
                    type: 'anime',
                    sources: JSON.stringify(res),
                    result: JSON.stringify(result),
                }
            })
        })
    }

    function AddtoFavorite() {
        if (result)
            dispatch(myListActions.addAnime(result))
    }

    function RemoveFromFavorite() {
        if (result)
            dispatch(myListActions.removeAnime(result.id.toString()))
    }


    const SeasonBox = () => <>


        <View style={{
            marginTop: 10,
        }}>

            <List.Section>
                <List.Accordion expanded
                    title={`${episodes?.length} Episodes`}>
                    <FlatList
                        data={episodes}
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.number}. ${v.title}`}
                            description={v.description}
                            onPress={() => {
                                setEpisode(v.number)
                                setTimeout(() => {
                                    play(v.sources)
                                }, 200);
                            }}
                            left={props => <Image {...props} source={{ uri: v.image }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)
                        }
                    />
                </List.Accordion>
            </List.Section>

        </View></>


    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <ImageBackground source={{ uri: result.bannerImage }} style={{
                width: width,
                height: height - 110,
            }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "rgba(0,0,0,.6)", padding: 10 }}>
                    <Image source={{ uri: result.coverImage }} style={{ width: 200, height: 300, resizeMode: 'cover', borderRadius: 5, }} />

                    <View style={{ marginVertical: 10, overflow: 'hidden', flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>

                        <Button mode="contained" style={{ marginVertical: 10, width: 250 }} onPress={() => {
                            play(source ?? [])
                        }} labelStyle={{
                            color: 'white'
                        }} >
                            Watch Now
                        </Button>
                        <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={30} color={theme.colors.primary} onPress={() => {
                            favorite ? RemoveFromFavorite() : AddtoFavorite()
                        }} />
                    </View>

                    <Text variant='headlineMedium' >{result?.title.english}</Text>
                    <Text variant='bodyLarge' >{result?.title.userPreferred}</Text>

                    <Divider style={{ marginVertical: 6 }} bold />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Text variant='labelLarge'>{result.year} </Text>
                        <Text variant='labelLarge'>{result.season}</Text>
                        <Text variant='labelLarge'>{result.episodes?.length} Episodes</Text>
                    </View>
                    <Text variant='labelLarge'>{result.averageScore} / 100</Text>
                </View>

            </ImageBackground>

            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                    {result?.genre?.map((genre) => {
                        return <Chip mode='outlined' style={{ margin: 2 }}>{genre}</Chip>
                    })}
                </View>
                <Text variant='bodySmall' >{result?.description}</Text>


                <SeasonBox />

                {Boolean(similars?.length) && <><Text variant='labelLarge' >Similar</Text>
                    <Divider style={{ marginVertical: 6, }} bold /></>}
                <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                    {similars?.sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0)).map((movie) => {
                        return <Card style={{ margin: 5, width: 180, }} onPress={() => {
                            router.push('anime/' + movie.id)
                        }} >
                            <Card.Cover source={{ uri: movie.coverImage }} />
                            <Card.Content>
                                <Text variant='bodySmall' >{movie.title.english ?? movie.title.userPreferred}</Text>
                                <Text variant='bodySmall' >{movie.type}</Text>
                            </Card.Content>
                        </Card>
                    }
                    )}
                </ScrollView>

            </View>

        </ScrollView>
    )
}

export default AnimeDetail

const styles = StyleSheet.create({
    select: {
        borderBottomColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        marginBottom: 20,
    },
})