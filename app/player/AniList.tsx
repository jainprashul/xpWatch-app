import React, { useEffect, useMemo } from 'react'
import { ScrollView, View, Image } from 'react-native'
import { List, SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import { AnimeDetail, Episode } from '../../types/animeDetail'
import { FlatList } from 'react-native-gesture-handler'
import { animeActions } from '../../store/context/animeSlice'
import { getAniEpisodeSources, getEpisodeSources } from '../../utils/db'
import analytics from '@react-native-firebase/analytics'
import { AniList } from '../../types/anilist'
import { EpisodeAni } from '../../types/anilistDetails'

type Props = {
    data: AniList
    srcs: any
}

const AniListWatch = ({ data, srcs }: Props) => {
    const dispatch = useAppDispatch()
    const src = useAppSelector((state) => state.player.src)
    useEffect(() => {
        if (srcs.length === 0) {
            console.log('no srcs')
            return
        }
        dispatch(playerAction.setSrc(srcs[0].url))
    }, [])

    const episode = useAppSelector((state) => state.anime.current.episode)
    const episodes = useAppSelector((state) => state.anime.episodes) as EpisodeAni[]

    const currentEp = useMemo(() => {
        return episodes?.find((v) => v.number === episode)
    }, [episode, episodes])


    useEffect(() => {
        if (currentEp) {
            (async () => {
                const srcs = await getAniEpisodeSources(currentEp?.id)
                if (srcs.length === 0) {
                    console.log('no srcs')
                    return
                }
                dispatch(playerAction.setSrc(srcs[0].url))
                analytics().logEvent('playing', {
                    content_type: 'anime',
                    item_id: data?.id,
                    title: data?.title.english ?? data.title.userPreferred,
                    episode: episode
                });
            })()
        }
    }, [episode])

    return (
        <View>
            <Text variant='labelLarge'>{episode}. {currentEp?.title}</Text>
            {/* <Text variant='labelSmall'>{currentEp?.airedAt}</Text> */}
            <Text variant='labelLarge'>{data?.title.english ?? data.title.userPreferred} </Text>
            <Text variant='labelSmall'>{data?.title.native}</Text>

            <Text>{currentEp?.description}</Text>
            <Text style={{
                marginVertical: 10
            }} variant='labelSmall'>Select Source</Text>

            <SegmentedButtons
                value={src}
                onValueChange={(value) => {
                    dispatch(playerAction.setSrc(value))
                }}
                buttons={srcs.map((src: any) => {
                    return { label: src.server, value: src.url }
                })}
            />


            <ScrollView>
                <List.Section>
                    <List.Accordion expanded
                        title="Episodes">
                        <FlatList
                            data={episodes}
                            renderItem={({ item: v }) => (<List.Item
                                key={v.id}
                                title={`${v.number}. ${v.title ?? 'Episode ' + v.number}`}
                                description={v.description}
                                onPress={() => {
                                    dispatch(animeActions.setEpisode(v.number))
                                }}
                                left={props => <Image {...props} source={{ uri: v.image ?? '' }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                            />)}
                            keyExtractor={item => item.id.toString()}
                        />
                    </List.Accordion>
                </List.Section>
            </ScrollView>
        </View>
    )
}

export default AniListWatch
