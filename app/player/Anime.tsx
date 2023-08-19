import React from 'react'
import { ScrollView, View } from 'react-native'
import { SegmentedButtons, Text } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { playerAction } from '../../store/context/playerSlice'
import { AnimeDetail } from '../../types/animeDetail'

type Props = {
    data: AnimeDetail
    srcs: any
}

const Anime = ({ data, srcs }: Props) => {
    const dispatch = useAppDispatch()
    const src = useAppSelector((state) => state.player.src)

    return (
        <View>
            <Text variant='labelLarge'>{ data?.title.english ?? data.title.userPreferred} </Text>
            <Text>{data.description}</Text>
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

            </ScrollView>


        </View>
    )
}

export default Anime