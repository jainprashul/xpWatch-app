import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Searchbar } from 'react-native-paper'
import { router } from 'expo-router'

const Search = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);
    function onSubmitEditing() {
        console.log('Submitted', searchQuery)
        if (searchQuery.trim().length < 3) return null
        router.push({
            pathname: 'search',
            params: {
                query: searchQuery
            }
        })

    }
    return (
        <View style={{ marginVertical: 10 }}>
            <Searchbar
                style={{ borderRadius: 30 }}
                placeholder="Search for Movies, TV Shows, Anime ..."
                onChangeText={onChangeSearch}
                onSubmitEditing={onSubmitEditing}
                value={searchQuery}
            />
        </View>
    )
}

export default Search

const styles = StyleSheet.create({})