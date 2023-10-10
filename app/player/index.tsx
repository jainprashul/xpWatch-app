import { LogBox, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, Stack } from 'expo-router';
import { theme } from '../../style/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ScrollView } from 'react-native-gesture-handler';
import Movie from './Movie';
import { myListActions } from '../../store/context/myListSlice';
import TV from './TV';
import Anime from './Anime';
import { useKeepAwake } from 'expo-keep-awake';
import { RecommandationView } from '../../components/OverviewDetails';
import AniList from './AniList';
import { Text } from 'react-native-paper';



const Player = () => {

    useKeepAwake();

    const { sources, type, result, recommandations } = useLocalSearchParams()
    const srcs = JSON.parse(sources as string)
    const data = JSON.parse(result as string)
    const recommandationsData = JSON.parse((recommandations ?? "[]") as string)
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    const XView = ({ type }: { type: string }) => {
        switch (type) {
            case 'tv':
                return <TV data={data} srcs={srcs} />
            case 'movie':
                return <Movie data={data} srcs={srcs} />
            case 'anime':
                return <Anime data={data} srcs={srcs} />
            case 'anilist':
                return <AniList data={data} srcs={srcs} />
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <Video data={data} type={type as string} />

            {/* <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => {
                video.current?.reload()
            }}>Reload</Button> */}

            <XView type={type as string} />

            <View style={{ height: 20 }} />
            <RecommandationView result={recommandationsData} text='Recommandations' />

        </ScrollView>
    )
}

export default Player
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10
    },
    video: {
        marginVertical: 30,
        height: 250,
        width: '100%',
        maxHeight: 250,
    },

})

function Video(
    { data, type }: {
        data: any,
        type: string,
        source?: string,
    }
) {
    const video = React.useRef<WebView>(null);
    const dispatch = useAppDispatch()

    const src = useAppSelector((state) => state.player.src)

    console.log("src ,", src)

    if (!src) {
        return <View style={styles.video}>
            <Text> Something Went Wrong </Text>
        </View>
    }

    return <View style={styles.video}>
        <WebView
            ref={video}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType='grant'
            onLoadEnd={() => {
                setTimeout(() => {
                    console.log('add to watch history')
                    dispatch(myListActions.addWatchHistory({
                        ...data,
                        type,
                        lastUpdated: Date.now(),
                    }))
                }, 5000);

            }}
            source={{
                uri: src,
            }} />
    </View>
}

export function Embed(
    { source }: {
        source: string,
    }
) {
    const video = React.useRef<WebView>(null);
    const src = source

    if (!src) {
        return null
    }

    return <View style={styles.video}>
        <WebView
            ref={video}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType='grant'
            source={{
                uri: src,
            }} />
    </View>
}