import { Image, StyleSheet, View, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { theme } from '../../style/theme'
import { fetchAnilist } from '../../utils/db'
import Loading from '../../components/Loading'
import { List, Text } from 'react-native-paper'
import analytics from '@react-native-firebase/analytics';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectHistoryByID } from '../../store/context/myListSlice'
import { animeActions } from '../../store/context/animeSlice'
import { POSTER_HEIGHT } from '../../components/Shared/List'
import MediaDetail from '../../components/Shared/MediaDetail'
import { AnimeMeta } from '../../types/meta/MediaMeta'

const AniListDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams()
    const history = useAppSelector(selectHistoryByID(id as string))

    useEffect(() => {
        if (history) {
            dispatch(animeActions.setEpisode(history.e))
        } else {
            dispatch(animeActions.setEpisode(1))
        }
    }, [history])

    const [data, setData] = React.useState({} as AnimeMeta)
    const [loading, setLoading] = React.useState(true)


    const setEpisode = (e: number) => {
        dispatch(animeActions.setEpisode(e))
    }

    useEffect(() => {
        console.log(id)
        fetchAnilist(id as string).then((res) => {
            setData(res)
            setLoading(false)
            analytics().logScreenView({
                screen_name: res.title,
                screen_class: 'Anime'
            });
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

    const SeasonBox = () => {
        const [sort, setSort] = React.useState(1)

        return <>
            <View style={{
                marginTop: 10,
            }}>

                <List.Section>
                    <FlatList
                        ListHeaderComponent={() => <List.Accordion expanded
                            onPress={() => {
                                setSort(-sort)
                            }}
                            right={() => <Text>
                                Sort {sort === 1 ? 'ASC' : 'DESC'}
                            </Text>}
                            title={`${data?.episodeCount} Episodes`}>
                        </List.Accordion>}
                        data={data?.episodes ?? []}
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.episodeNumber}. ${v.name}`}
                            description={v.description}
                            onPress={() => {
                                setEpisode(v.episodeNumber)
                                // setTimeout(() => {
                                // play(v.id)
                                // }, 200);
                            }}
                            left={props => <Image {...props} source={{ uri: v.image }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)
                        }
                    />
                </List.Section>

            </View></>
    }

    return (
        <MediaDetail data={data} type='anilist'>
            <SeasonBox />
        </MediaDetail>
    )
}

export default AniListDetail

const styles = StyleSheet.create({
    select: {
        borderBottomColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        marginBottom: 20,
    },
    poster: {
        height: POSTER_HEIGHT,
        aspectRatio: 2 / 3,
    }
})