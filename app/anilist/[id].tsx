import { Image, StyleSheet, View, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
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
import { playerAction } from '../../store/context/playerSlice'
const { height } = Dimensions.get('window')

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

    const currentEpisodeNo = useAppSelector(state => state.anime.current.episode)




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

        const _episodes = useMemo(() => {
            return [...data?.episodes ?? []].sort((a, b) => {
                if (sort === 1) {
                    return a.episodeNumber - b.episodeNumber
                } else {
                    return b.episodeNumber - a.episodeNumber
                }
            })
        }, [sort])

        return <>
            <View style={{
                marginTop: 10,
            }}>

                <List.Section>
                    <List.Accordion expanded
                        onPress={() => {
                            setSort(-sort)
                        }}
                        right={() => <Text>
                            Sort {sort === 1 ? 'ASC' : 'DESC'}
                        </Text>}
                        title={`${data?.episodeCount} Episodes`}>
                    </List.Accordion>
                    <FlatList
                        style={styles.list}
                        nestedScrollEnabled
                        initialScrollIndex={_episodes.findIndex(v => v.episodeNumber === currentEpisodeNo)}
                        isTVSelectable
                        data={_episodes ?? []}
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.episodeNumber}. ${v.name}`}
                            description={v.description}
                            onPress={() => {
                                setEpisode(v.episodeNumber)
                                dispatch(playerAction.setData(data))
                                setTimeout(() => {
                                    router.push({
                                        pathname: 'player',
                                        params: {
                                            type: data.media_type,
                                        }
                                    })
                                }, 100);
                            }}

                            left={props => <Image {...props} source={{ uri: v.image }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)
                        }
                    />
                </List.Section>

            </View></>
    }

    return (
        <MediaDetail data={data} type='anilist' currentEpisode={`E${currentEpisodeNo}`} >
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
    },
    list: {
        backgroundColor: theme.colors.background,
        flexGrow: 0,
        height: height * .65
    }
})