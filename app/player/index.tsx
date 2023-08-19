import { StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { WebView } from 'react-native-webview';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { theme } from '../../style/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { tv } from '../../utils/constants';
import { tvActions } from '../../store/context/tvSlice';
import { ScrollView } from 'react-native-gesture-handler';
import Movie from './Movie';
import { myListActions } from '../../store/context/myListSlice';
import { playerAction } from '../../store/context/playerSlice';
import TV from './TV';
import Anime from './Anime';



const Player = () => {
    const dispatch = useAppDispatch()
    const { sources, type, result } = useLocalSearchParams()
    console.log(sources)
    const src = useAppSelector((state) => state.player.src)
    const video = React.useRef<WebView>(null);
    
    const srcs = JSON.parse(sources as string)
    const data = JSON.parse(result as string)

    const XView = ({ type }: { type: string}) => {
        switch (type) {
            case 'tv':
                return <TV data={data} srcs={srcs} />
            case 'movie':
                return <Movie data={data} srcs={srcs} />
            default:
                return <Anime data={data} srcs={srcs} />
        }
    }

    useEffect(() => {
        dispatch(playerAction.setSrc(srcs[0].url))
    }, [])

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <View style={styles.video}>
                <WebView
                    ref={video}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    mediaCapturePermissionGrantType='grant'
                    onLoadEnd={() => {
                        setTimeout(() => {
                            dispatch(myListActions.addToLastWatched(data))
                        }, 10000);
                    }}
                    source={{
                        uri: src,
                    }} />
            </View>

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