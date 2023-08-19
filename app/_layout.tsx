
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import Loading from '../components/Loading';
import { theme } from '../style/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStart } from '../components/useAppStart';

export default function Layout() {
  return (
    <>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor} />
      <AppLayout />
    </Provider>
    </>
  );
}


function AppLayout() {
  useAppStart()
  return (
    <SafeAreaProvider>
    <PaperProvider theme={theme}>
       <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:  theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
    </PaperProvider>
    </SafeAreaProvider>
  );
}