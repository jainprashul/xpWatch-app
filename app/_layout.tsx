
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import Loading from '../components/Loading';
import { theme } from '../style/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStart } from '../components/useAppStart';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export default function Layout() {

  Updates.useUpdateEvents(async (event) => {
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      await Updates.fetchUpdateAsync()
      alert('Update downloaded, will install now');
      await Updates.reloadAsync();
    } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
      console.log('No update available');
    } else if (event.type === Updates.UpdateEventType.ERROR) {
      // handle error
      console.log('Error while checking for updates', event.message);
      alert('Error while checking for updates');
    } 


  });

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
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
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