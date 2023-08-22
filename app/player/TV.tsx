import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import { List, SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import { TVDetails } from '../../types/tvDetails'
import { tvActions } from '../../store/context/tvSlice'
import { getTVSeasonEpisodeSources } from '../../utils/db'
import { myListActions } from '../../store/context/myListSlice'
import analytics from '@react-native-firebase/analytics'

type Props = {
    data: TVDetails
    srcs: any
}

const TV = ({ data, srcs }: Props) => {
    const dispatch = useAppDispatch()
    const src = useAppSelector((state) => state.player.src)
    const { season, episode } = useAppSelector((state) => state.tv.current)
    const { episodes } = useAppSelector((state) => state.tv.season)
    const { name , overview, episode_number, runtime , air_date} = episodes[episode - 1]

    useEffect(() => {
        const srcs = getTVSeasonEpisodeSources(data.id.toString(), season, episode, data.external_ids.imdb_id)
        dispatch(playerAction.setSrc(srcs[0].url))

        setTimeout(() => {
            console.log('add to history')
            dispatch(myListActions.addToHistory({
                id: data.id.toString(),
                e : episode,
                s : season
            }))
        }, 3000);

        analytics().logEvent('playing', {
            content_type: 'tv',
            item_id: data?.id,
            title: data?.name,
            season : season,
            episode : episode
        });
    }, [season, episode])

    return (
        <View>
            <Text variant='labelLarge'>{episode_number}. {name}</Text>
            <Text variant='labelSmall'>{runtime} mins - {air_date}</Text>
            <Text variant='labelLarge'>{data.name}</Text>

            <Text>{overview}</Text>
            


            <Text style={{
                marginVertical: 10
            }} variant='labelSmall'>Select Source</Text>

            <SegmentedButtons
                value={src}
                onValueChange={(value) => {
                    console.log("srcs :: ", value)
                    dispatch(playerAction.setSrc(value))
                }}
                buttons={srcs.map((src: any) => {
                    return { label: src.server, value: src.url }
                })}
            />

            
            <List.Section>
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
            </List.Section>


        </View>
    )
}

export default TV