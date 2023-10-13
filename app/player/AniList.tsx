import React, { useEffect, useMemo } from 'react'
import { ScrollView, View, Image } from 'react-native'
import { Button, List, SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import { AnimeDetail, Episode } from '../../types/animeDetail'
import { FlatList } from 'react-native-gesture-handler'
import { animeActions } from '../../store/context/animeSlice'
import { AniEpisodeSrc, getAniEpisodeSources, getEpisodeSources } from '../../utils/db'
import analytics from '@react-native-firebase/analytics'
import { myListActions } from '../../store/context/myListSlice'
import { AnimeMeta } from '../../types/meta/MediaMeta'

type Props = {
}

const AniListWatch = ({ }: Props) => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.player.data) as AnimeMeta

    const src = useAppSelector((state) => state.player.src)
    const currentEpsNo = useAppSelector((state) => state.anime.current.episode)

    const episode = useMemo(() => {
        return data.episodes.find((v) => v.episodeNumber === currentEpsNo)!
    }, [currentEpsNo])

    const [srcs, setSrcs] = React.useState<AniEpisodeSrc[]>([]);

    useEffect(() => {
        (async () => {
            const _srcs = await getAniEpisodeSources(episode.id as string)
            console.log('srcs', _srcs)
            dispatch(playerAction.setSrc(_srcs?.[0]?.url ?? null))
            setSrcs(_srcs)

            setTimeout(() => {
                console.log('add to history')
                dispatch(myListActions.addToHistory({
                    id: data.id.toString(),
                    e: currentEpsNo,
                    s: 0,
                }))
            }, 3000);
            analytics().logEvent('playing', {
                content_type: 'anime',
                item_id: data?.id,
                title: `${data.title} - E${episode.episodeNumber}`,
                episode: currentEpsNo
            });
        })();
    }, [currentEpsNo])

    return (
        <View>
            <Text variant='labelLarge'>{currentEpsNo}. {episode.name}</Text>
            {/* <Text variant='labelSmall'>{currentEp?.airedAt}</Text> */}
            <Text variant='labelLarge'>{data?.title} </Text>
            <Text variant='labelSmall'>{data?.tagline}</Text>

            <Text>{episode?.description}</Text>
            <Text style={{
                marginVertical: 10
            }} variant='labelSmall'>Select Source</Text>

            <SegmentedButtons
                value={src!}
                onValueChange={(value) => {
                    dispatch(playerAction.setSrc(value))
                }}
                buttons={srcs.map((src: any) => {
                    return { label: src.server, value: src.url }
                })}
            />

            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Button disabled={currentEpsNo < 2} onPress={() => {
                    dispatch(animeActions.setEpisode(Math.max(currentEpsNo - 1, 1)))
                }}>Previous Episode</Button>

                <Text>{currentEpsNo} / {data.episodes.length}</Text>

                <Button disabled={currentEpsNo === data.episodes.length} onPress={() => {
                    dispatch(animeActions.setEpisode(Math.min(currentEpsNo + 1, data.episodes.length)))
                }}>Next Episode</Button>
            </View>

        </View>
    )
}

export default AniListWatch
