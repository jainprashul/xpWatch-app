import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import { theme } from '../style/theme'
import { FontAwesome } from '@expo/vector-icons';

type RatingsProps = {
  ratings: number
}

const Ratings = ({ ratings }: RatingsProps) => {
  const filledStars = Math.floor(ratings / 2)
  const halfStars = Math.floor(ratings % 2)
  const emptyStars = 5 - (filledStars + halfStars)

  const r = [...Array(filledStars).fill('star'), ...Array(halfStars).fill('star-half-o'), ...Array(emptyStars).fill('star-o')]
  return (
    <View style={styles.ratings}>
      <Text variant='labelLarge' style={styles.ratingNumber}>{ratings}</Text>
      {r.map((item, index) => (
        <FontAwesome key={index} name={item} size={14} color={'tomato'} />
      ))}
    </View>
  )
}

export default Ratings

const styles = StyleSheet.create({
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    marginRight: 5,
  },
})