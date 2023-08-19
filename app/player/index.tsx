import { StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
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



const Player = () => {
    const dispatch = useAppDispatch()

    useKeepAwake();
    
    const { sources, type, result } = useLocalSearchParams()
    const srcs = JSON.parse(sources as string)
    const data = JSON.parse(result as string)

    const XView = ({ type }: { type: string }) => {
        switch (type) {
            case 'tv':
                return <TV data={data} srcs={srcs} />
            case 'movie':
                return <Movie data={data} srcs={srcs} />
            case 'anime':
                return <Anime data={data} srcs={srcs} />
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
    }
) {
    const video = React.useRef<WebView>(null);
    const dispatch = useAppDispatch()

    const src = useAppSelector((state) => state.player.src)


    return <View style={styles.video}>
        <WebView
            ref={video}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType='grant'
            onLoadEnd={() => {
                setTimeout(() => {
                    console.log('add to last watched')
                    dispatch(myListActions.addToLastWatched({
                        ...data,
                        type,
                    }))
                }, 10000);
            }}
            source={{
                uri: src,
            }} />
    </View>
}