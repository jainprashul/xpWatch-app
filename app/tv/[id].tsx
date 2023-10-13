import { StyleSheet, View, FlatList, Image, } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { fetchTVDetails, getTVSeasonData } from '../../utils/db'
import { Stack } from 'expo-router'
import Loading from '../../components/Loading'
import { theme } from '../../style/theme'
import { List, Text } from 'react-native-paper'
import { Dimensions } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { tvActions } from '../../store/context/tvSlice'
import { selectHistoryByID } from '../../store/context/myListSlice'
import analytics from '@react-native-firebase/analytics'
import { Episode } from '../../types/seasonDetail'
import MediaDetail from '../../components/Shared/MediaDetail'
import { TVMeta } from '../../types/meta/MediaMeta'

const height = Dimensions.get('window').height


const TvPage = () => {
    const dispatch = useAppDispatch()

    const { id } = useLocalSearchParams()
    const [data, setData] = React.useState({} as TVMeta)

    const history = useAppSelector(selectHistoryByID(id as string))
    
    useEffect(() => {
        if (history) {
            dispatch(tvActions.setSeason(history.s))
            dispatch(tvActions.setEpisode(history.e))
        } else {
            dispatch(tvActions.setSeason(1))
            dispatch(tvActions.setEpisode(1))
        }
    }, [history])

    const season = useAppSelector(state => state.tv.season)
    const current = useAppSelector(state => state.tv.current)

    const [loading1, setLoading1] = React.useState(true)
    const [loading2, setLoading2] = React.useState(true)
    const [sort, setSort] = React.useState(1)


    useEffect(() => {
        fetchTVDetails(id as string).then((res) => {
            setData(res)
            setLoading1(false)
            analytics().logScreenView({
                screen_name: res.title,
                screen_class: 'TV'
            })
        }).catch((err) => {
            console.log('tv ', err)
            setLoading1(false)
        })
    }, [id])

    useEffect(() => {
        getTVSeasonData(id as string, current.season).then((res) => {
            dispatch(tvActions.setSeasonDetail(res))
            setLoading2(false)
        }).catch((err) => {
            console.log('season ', err)
        })
    }, [current.season])

    if (loading1 || loading2) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }

    const SeasonBox = () => <>
        <Picker style={styles.select} mode='dropdown'
            selectedValue={current.season}
            onValueChange={(itemValue) => dispatch(tvActions.setSeason(itemValue))}>
            {data?.seasons?.map(v => <Picker.Item value={v.seasonNumber} key={v.seasonNumber} label={`${v.name}`} />)}
        </Picker>

        <View>
            <Text variant='labelLarge' >{season?.name}</Text>
            <Text variant='bodyMedium' >{season?.overview}</Text>
            <Text variant='labelLarge' >{season?.air_date?.toString()}</Text>
            <Text variant='labelLarge' >{season?.episodes?.length} Episodes</Text>

            <List.Section>
                    <FlatList
                        ListHeaderComponent={()=> <List.Accordion expanded
                            onPress={() => {
                               setSort(-sort)
                           }}
                           right={() => <Text>
                               Sort {sort === 1 ? 'ASC' : 'DESC'}
                           </Text>}
                           
                               title="Episodes">
                           </List.Accordion>}
                        data={JSON.parse(JSON.stringify(season?.episodes)).sort((a : Episode, b : Episode) => sort * (a.episode_number - b.episode_number))}
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.episode_number}. ${v.name}`}
                            description={v.overview}
                            onPress={() => {
                                dispatch(tvActions.setEpisode(v.episode_number))
                                setTimeout(() => {
                                    // play()
                                }, 100);
                            }}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w300${v.still_path}` }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)}
                        keyExtractor={item => item.id.toString()}
                    />
            </List.Section>
        </View></>

    return (
      <MediaDetail data={data} type='tv'>
            <SeasonBox />
      </MediaDetail>
    )
}

export default TvPage

const styles = StyleSheet.create({
    select: {
        borderBottomColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        marginBottom: 20,
    },
})