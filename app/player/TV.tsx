import React, { useEffect, useMemo } from 'react'
import { View, Image } from 'react-native'
import { Button, List, SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import { TVDetails } from '../../types/tvDetails'
import { tvActions } from '../../store/context/tvSlice'
import { getTVSeasonEpisodeSources } from '../../utils/db'
import { myListActions } from '../../store/context/myListSlice'
import analytics from '@react-native-firebase/analytics'
import { TVMeta } from '../../types/meta/MediaMeta'

type Props = {

}

const TV = ({  }: Props) => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.player.data) as TVMeta
    
    const src = useAppSelector((state) => state.player.src)
    const { season, episode } = useAppSelector((state) => state.tv.current)
    const { episodes } = useAppSelector((state) => state.tv.season)

    const srcs = useMemo(() => {
        return getTVSeasonEpisodeSources(data.id, season, episode, data.imdb)
    }, [season, episode])

    const { name, description, episodeNumber, runtime, releaseDate } = episodes[episode - 1]

    useEffect(() => {

        dispatch(playerAction.setSrc(srcs[0].url))

        setTimeout(() => {
            console.log('add to history')
            dispatch(myListActions.addToHistory({
                id: data.id,
                e: episode,
                s: season
            }))
        }, 5000);

        analytics().logEvent('playing', {
            content_type: 'tv',
            item_id: data.id,
            title: data.title,
            season: season,
            episode: episode
        });
    }, [season, episode])

    return (
        <View style={{
            marginTop: -20
        }}>
            <Text variant='labelLarge'>{episodeNumber}. {name}</Text>
            <Text variant='labelSmall'>{runtime} mins - {releaseDate}</Text>
            <Text variant='bodyLarge'>{data.title}</Text>
            <Text variant='bodySmall'>{data.tagline}</Text>

            <Text>{description}</Text>



            <Text style={{
                marginVertical: 10
            }} variant='labelSmall'>Select Source</Text>

            <SegmentedButtons
                value={src!}
                onValueChange={(value) => {
                    console.log("srcs :: ", value)
                    dispatch(playerAction.setSrc(value))
                }}
                buttons={srcs.map((src: any) => {
                    return { label: src.server, value: src.url }
                })}
            />

            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" , marginTop : 10 }}>
                <Button disabled={episode < 2} onPress={() => {
                    dispatch(tvActions.setEpisode(Math.max(episode - 1, 1)))
                }}>Previous Episode</Button>

                <Text>{episode} / {episodes.length}</Text>

                <Button disabled={episode === episodes.length} onPress={() => {
                    dispatch(tvActions.setEpisode(Math.min(episode + 1, episodes.length)))
                }}>Next Episode</Button>
            </View>

            {/* <List.Section>
                <List.Accordion expanded
                    title="Episodes">
                    {
                        episodes.map(v => <List.Item 
                            key={v.id} 
                            title={`${v.episode_number}. ${v.name}`} 
                            description={v.overview}
                            onPress={()=>{
                                dispatch(tvActions.setEpisode(v.episode_number))
                            }}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w300${v.still_path}` }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                            />)
                    }
                </List.Accordion>
            </List.Section> */}


        </View>
    )
}

export default TV