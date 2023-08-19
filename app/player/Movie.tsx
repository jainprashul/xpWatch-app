import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { MovieDetail } from '../../types/movieDetail'
import { SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'

type Props = {
    data: MovieDetail
    srcs: any
}

const Movie = ({ data, srcs }: Props) => {
    const dispatch = useAppDispatch()
    const src = useAppSelector((state) => state.player.src)

    useEffect(() => {
        dispatch(playerAction.setSrc(srcs[0].url))
    }, [])

    return (
        <View>
            <Text variant='labelLarge'>{data.title}</Text>
            <Text>{data.overview}</Text>
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
        </View>
    )
}

export default Movie