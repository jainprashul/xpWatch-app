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
import { useKeepAwake } from 'expo-keep-awake';
import { Text } from 'react-native-paper';
import { MediaMeta_to_MediaMini } from '../../utils/converter';
import { playerAction } from '../../store/context/playerSlice';
import AniList from './AniList';



const Player = () => {

    useKeepAwake();

    const {  type } = useLocalSearchParams()


    console.log("type", type)

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        return () => {
            playerAction.setSrc(null)
        }
    }, [])

    const XView = ({ type }: { type: string }) => {
        switch (type) {
            case 'tv':
                return <TV  />
            case 'movie':
                return <Movie  />
            // case 'anime':
            //     return <Anime data={data} srcs={srcs} />
            case 'anilist':
                return <AniList />
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <Video />

            {/* <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => {
                video.current?.reload()
            }}>Reload</Button> */}

            <XView type={type as string} />


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
        backgroundColor: "#000",
    },

})

function Video() {
    const video = React.useRef<WebView>(null);
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.player.data) as any

    if (!data) {
        return null
    }
    const src = useAppSelector((state) => state.player.src)

    if (!src) {
        return <View style={{ ...styles.video , justifyContent : "center" , alignItems: "center"}}>
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
                    dispatch(myListActions.addWatchHistory(MediaMeta_to_MediaMini(data)))
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