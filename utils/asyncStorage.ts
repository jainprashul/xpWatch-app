import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to delete all data from AsyncStorage
export const deleteAllData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys(); // Get all keys from AsyncStorage
    console.log('All keys:', allKeys);
    await AsyncStorage.multiRemove(allKeys); // Remove all keys

    // Display a success message or perform any other actions
    console.log('All data deleted successfully!');
  } catch (error) {
    // Handle error
    console.log('Error deleting data:', error);
  }
};