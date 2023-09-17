import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, TouchableOpacity, Pressable, TouchableHighlight } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { generateRandomColor } from '../../utils/utils'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width 
const ITEM_HEIGHT = ITEM_WIDTH * 1.4
const SPACING = 0

type Props = {
    data: Array<any>
}
const Slider = ({data}: Props) => {
  const isCarousel = React.useRef<FlatList>(null)
  const [index, setIndex] = React.useState(0)

  return (
    <View style={styles.container}>
    <View>
      <FlatList data={data} renderItem={({ item }) => {
        return <BannerCard item={item} />
      }}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING * 2}
        decelerationRate={'fast'}
        ref={isCarousel}
        onScroll={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING * 2))
          if (index !== newIndex) {
            setIndex(newIndex)
          }
        }}
        />
    </View>
    {
      data.length > 1 ? <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      {
        data.map((_, i) => {
          return (
            <View key={i} style={{width: 10, height: 10, borderRadius: 5, backgroundColor: index === i ? "#fff" : '#444' , margin: 5}} />
          )
        }
        )
      }
      </View> : null
    }
    </View>
  )
}

export default Slider

type BannerCardProps = {
    item: any
}

function BannerCard({ item }: BannerCardProps) {
    return (
        <TouchableHighlight onPress={()=> {
            // console.log(item)
            router.push(`${item.media_type}/${item.id}}`)
                
        }}>
        <ImageBackground style={styles.card} source={{
            uri: `https://image.tmdb.org/t/p/w780${item.poster_path}`
        }}>
            
        </ImageBackground>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        marginBottom: -20,
    },
    card : {  
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      borderRadius: 20,
      margin: SPACING,
      // backgroundColor: generateRandomColor(),
      
    },
})