import React, { useEffect } from 'react'
import { View } from 'react-native'
import { SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import analytics from '@react-native-firebase/analytics'
import { MovieMeta } from '../../types/meta/MediaMeta'
import { getMovieSources } from '../../utils/db'

type Props = {
    
}

const Movie = ({  }: Props) => {
    const dispatch = useAppDispatch()
    const src = useAppSelector((state) => state.player.src)
    const data = useAppSelector((state) => state.player.data) as MovieMeta
    const srcs = getMovieSources(data.id, data.imdb)

    useEffect(() => {
        dispatch(playerAction.setSrc(srcs[0].url))
        analytics().logEvent('playing', {
            content_type: 'movie',
            item_id: data?.id,
            title: data?.title
        });
    }, [])

    return (
        <View>
            <Text variant='headlineMedium' >{data.title}</Text>
            <Text variant='bodyLarge' >{data.tagline}</Text>
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

            <Text style={{
                marginVertical: 10
            }} variant='labelSmall'>Overview</Text>
            <Text variant='bodySmall' >{data.description}</Text>
        </View>
    )
}

export default Movie