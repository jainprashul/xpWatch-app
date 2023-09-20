import { StyleSheet, View, FlatList, Image, Share, } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { TvShowsSrc, TvShowsX, getTVData, getTVSeasonData, getTVSeasonEpisodeSources } from '../../utils/db'
import { Stack } from 'expo-router'
import Loading from '../../components/Loading'
import { theme } from '../../style/theme'
import { Button, Divider, List, Surface, Text } from 'react-native-paper'
import { router } from 'expo-router';
import Overview from '../../components/Overview'
import { Picker } from '@react-native-picker/picker'
import { getYear } from '../../components/Shared/List'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { tvActions } from '../../store/context/tvSlice'
import { has, myListActions, selectHistoryByID } from '../../store/context/myListSlice'
import { MaterialIcons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics'
import Ratings from '../../components/Ratings'
import { Episode } from '../../types/seasonDetail'


const TvPage = () => {
    const dispatch = useAppDispatch()

    const { id } = useLocalSearchParams()
    const [data, setData] = React.useState({} as TvShowsX)
    const { cast, imdb, recommandations, result, similars } = data!;

    const history = useAppSelector(selectHistoryByID(id as string))
    const favorite = useAppSelector(has('tv', id as string))
    const watched = useAppSelector(has('watchedAlready', id as string))
    
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

    const [sources, setSources] = React.useState<TvShowsSrc>([])

    const [loading1, setLoading1] = React.useState(true)
    const [loading2, setLoading2] = React.useState(true)
    const [sort, setSort] = React.useState(1)


    useEffect(() => {
        console.log(id)
        getTVData(id as string).then((res) => {
            setData(res)
            setLoading1(false)
            analytics().logScreenView({
                screen_name: res?.result.name ?? 'TV',
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

    useEffect(() => {
        const srcs = getTVSeasonEpisodeSources(id as string, current.season, current.episode, imdb)
        setSources(srcs)
    }, [id, current.season, current.episode, imdb])


    if (loading1 || loading2) {
        return <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <Loading />
        </>
    }

    function AddtoFavorite() {
        if (result)
            dispatch(myListActions.addTVShow(result))
            analytics().logEvent('add_to_favorite', {
                content_type: 'tv',
                item_id: result?.id,
                title : result?.name
            });
    }

    function RemoveFromFavorite() {
        if (result)
            dispatch(myListActions.removeTVShow(result.id.toString()))
            analytics().logEvent('remove_from_favorite', {
                content_type: 'tv',
                item_id: result?.id,
                title : result?.name
            });
    }

    function AddtoWatched() {
        if(result)
        dispatch(myListActions.addWatchedAlready({
            ...result,
            type : 'tv'
        }))
        analytics().logEvent('add_to_watched', {
            content_type: 'tv',
            item_id: result?.id,
            title : result?.name
        });
    }

    function RemoveFromWatched() {
        if(result)
        dispatch(myListActions.removeWatchedAlready(result.id.toString()))
        analytics().logEvent('remove_from_watched', {
            content_type: 'tv',
            item_id: result?.id,
            title : result?.name
        });
    }

    const SeasonBox = () => <>
        <Picker style={styles.select} mode='dropdown'
            selectedValue={current.season}
            onValueChange={(itemValue) => dispatch(tvActions.setSeason(itemValue))}>
            {result?.seasons?.map(v => <Picker.Item value={v.season_number} key={v.season_number} label={`${v.name}`} />)}
        </Picker>

        <View>
            <Text variant='labelLarge' >{season?.name}</Text>
            <Text variant='bodyMedium' >{season?.overview}</Text>
            <Text variant='labelLarge' >{season?.air_date?.toString()}</Text>
            <Text variant='labelLarge' >{season?.episodes?.length} Episodes</Text>

            <List.Section>
                <List.Accordion expanded
                 onPress={() => {
                    setSort(-sort)
                }}
                right={() => <Text>
                    Sort {sort === 1 ? 'ASC' : 'DESC'}
                </Text>}
                    title="Episodes">
                    <FlatList
                        data={JSON.parse(JSON.stringify(season?.episodes)).sort((a : Episode, b : Episode) => sort * (a.episode_number - b.episode_number))}
                        renderItem={({ item: v }) => (<List.Item
                            key={v.id}
                            title={`${v.episode_number}. ${v.name}`}
                            description={v.overview}
                            onPress={() => {
                                dispatch(tvActions.setEpisode(v.episode_number))
                                setTimeout(() => {
                                    play()
                                }, 100);
                            }}
                            left={props => <Image {...props} source={{ uri: `https://image.tmdb.org/t/p/w300${v.still_path}` }} style={{ width: 80, height: 100, borderRadius: 10, marginVertical: 10 }} />}
                        />)}
                        keyExtractor={item => item.id.toString()}
                    />
                </List.Accordion>
            </List.Section>

        </View></>

    function play() {
        // console.log(sources)
        router.push({
            pathname: 'player',
            params: {
                type: 'tv',
                sources: JSON.stringify(sources),
                result: JSON.stringify(result),
                recommandations: JSON.stringify(recommandations),
            }
        })
    }

    return (
        <Overview cast={cast} recommandations={recommandations} result={result} similars={similars} seasons={<SeasonBox />} >
            <View style={{ marginVertical: 10, overflow: 'hidden', flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>
                <Button mode="contained" style={{ marginVertical: 10, width: 250 }} onPress={play} labelStyle={{
                    color: 'white'
                }} >
                    Watch Now - S{current.season} E{current.episode}
                </Button>
                <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={30} color={theme.colors.primary} onPress={() => {
                    favorite ? RemoveFromFavorite() : AddtoFavorite()
                }} />
                 <MaterialIcons name={watched ? "bookmarks" : "bookmark-border"} size={30} color={theme.colors.primary} onPress={()=>{
                watched ? RemoveFromWatched() : AddtoWatched() }} />
              <MaterialIcons name="share" size={30} color={theme.colors.primary} onPress={()=>{
                Share.share({
                    message : `Watch ${result?.name} on xpWatch /n https://xpwatch.vercel.app/tv/${result?.id}`
                }, {
                    dialogTitle : `Share ${result?.name}`,
                    subject : `Watch ${result?.name} on xpWatch`,
                })
            }} />

            </View>

            <Text variant='headlineMedium' >{result?.name}</Text>
            <Text variant='bodyLarge' >{result?.tagline}</Text>
            <Divider style={{ marginVertical: 6 }} bold />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Text variant='labelLarge'>{getYear(result.first_air_date)} </Text>
                <Text variant='labelLarge'>{result.number_of_seasons} Seasons</Text>
                <Text variant='labelLarge'>{result.number_of_episodes} Episodes</Text>
            </View>
            <Ratings ratings={result?.vote_average ?? 0} />
        </Overview>
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