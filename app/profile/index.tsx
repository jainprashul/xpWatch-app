import { StyleSheet, View } from 'react-native'
import React from 'react'
import { theme } from '../../style/theme'
import { Stack } from 'expo-router'
import { Avatar, Button, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store/hooks'

const Profile = () => {

    const user = useAppSelector(state => state.auth.user)

    console.log(user)

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: true,
                title: 'User Profile',
            }} />

            <View style={{
                width: '100%',
                alignItems: 'center',
            }}>
                {/* <Avatar.Image size={100} source={{ uri: user?.photoURL ?? '' }} /> */}
                
                <TextInput
                    label="Username"
                    value={user?.displayName ?? 'Anonymous'}
                    mode="outlined"
                    disabled
                    style={styles.input}
                />

                <TextInput
                    label="Email"
                    value={user?.email ?? 'Anonymous'}
                    mode="outlined"
                    disabled
                    style={styles.input}
                />

            </View>


            <Button mode="contained" style={styles.input} onPress={() => { }}>
                Logout
            </Button>


        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        marginVertical: 10,
        width: '100%',
    },
})