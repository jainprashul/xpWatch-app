
import { StyleSheet, View, ImageBackground, Image, Dimensions } from 'react-native'
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import OverviewDetails from './OverviewDetails'
import { theme } from '../style/theme'

type Props = {
    result: any
    cast: any
    recommandations: any
    similars: any
    seasons ?: React.ReactNode
    children?: React.ReactNode
}

const Overview = ({ cast, recommandations, result, similars, children, seasons }: Props) => {
    const { width, height } = Dimensions.get('window')

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: theme.colors.background,
        }}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <ImageBackground source={{ uri: `https://image.tmdb.org/t/p/w780${result.backdrop_path}` }} style={{
                width: width,
                height: height - 110,
            }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "rgba(0,0,0,.6)", padding: 10 }}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w342${result?.poster_path}` }} style={{ width: 200, height: 300, resizeMode: 'cover', borderRadius: 5, }} />

                    {children}


                </View>
            </ImageBackground>


            <OverviewDetails result={result} seasons={seasons} cast={cast as any} recommandations={recommandations as any} similars={similars as any} />

        </ScrollView>
    )
}

export default Overview

const styles = StyleSheet.create({})