import { StyleSheet, View, ToastAndroid, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { theme } from '../../style/theme'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAppDispatch } from '../../store/hooks'
import { Button, Card, Text, TextInput } from 'react-native-paper'
import auth from '@react-native-firebase/auth'

const logo = 'https://xpwatch.vercel.app/logo.png'

const LoginPage = () => {

  const dispatch = useAppDispatch();


  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState('');

  const _onLoginPressed = async () => {
    try {
      console.log("Login Pressed");
      setLoading(true);
      if (username.length === 0 || password.length === 0) {
        throw new Error("Username or Password cannot be empty");
      }

      const res = await auth().signInWithEmailAndPassword(username, password);

      if (res.user) {
        // router.replace('/');
        ToastAndroid.show('Logged In successfully.', ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.log(error);

      switch (error.code) {
        case 'auth/wrong-password':
          setError('Wrong password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('User not found. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email. Please type a valid email.');
          break;

        default:
          setError('Something went wrong. Please try again later.');
          break;
      }
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: false,
        statusBarColor: theme.colors.background,
      }} />


      <StatusBar style="light" />

      <Card.Cover source={{ uri: logo }} style={{ width: 180, height: 150, alignSelf: 'center', backgroundColor: "transparent" }} />
      <Text variant='headlineMedium' style={{ textAlign: 'center', margin: 10, color: "white" }}>xpWatch</Text>

      <Card style={styles.card}>
        <Text variant='titleLarge' style={{ textAlign: 'center', margin: 20, }}>Login</Text>
        <Card.Content>
          <TextInput
            label={'Email'}
            placeholder='Email'
            style={styles.input}
            value={username}
            onChangeText={text => { setUsername(text); setError(''); }}
          />
          <TextInput
            label={'Password'}
            placeholder='Password'
            style={styles.input}
            value={password}
            secureTextEntry={!visible}
            onChangeText={text => { setPassword(text); setError(''); }}
            right={<TextInput.Icon icon={visible ? 'eye-off' : 'eye'} onPress={() => { setVisible(!visible) }} />}
          />

          <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>

          <Button mode='contained' textColor='white' disabled={loading} style={{ marginBottom: 20, }} onPress={_onLoginPressed}>Login</Button>
          <Card.Actions>
            <Card.Content>
              <TouchableOpacity onPress={() => {
                Linking.openURL('https://xpwatch.vercel.app/signup')
              }}>
                <Text style={{ textAlign: 'center' }}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card.Actions>
        </Card.Content>

      </Card>
    </View>
  )
}

export default LoginPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },


  input: { marginBottom: 20, backgroundColor: theme.colors.background },
  card: { width: '90%', backgroundColor: theme.colors.background, borderRadius: 10, }
})
