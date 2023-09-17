import firestore from '@react-native-firebase/firestore';
import { store } from '../store';
import { myListActions } from '../store/context/myListSlice';
import { Alert } from 'react-native';

export async function loadUserDataFromCloud(uid : string) {
        const userData = await firestore().collection('users').doc(uid).get();
        console.log("userData", userData.data());
        return userData.data();
}

export async function saveUserDataToCloud(uid : string, data : any) {
        await firestore().collection('users').doc(uid).update(data);
}

export async function getListData(uid : string) {
        const data = await loadUserDataFromCloud(uid);
        if (data) {
            return {
                raw : data._data,
                data : JSON.parse(data?._data)
            }
        }
        return null;
}

export async function syncwithRedux(uid : string) {
        // get data from cloud
        const cloudData = await getListData(uid);
        
        // get data from redux
        const reduxData = JSON.stringify(store.getState().myList.data);

        // compare data
        if (compareData(cloudData?.raw, reduxData)) {
            // data is same
            return;
        }

        // data is different
        // check with user if they want to sync data from cloud or redux
        const confirm = Alert.alert("Sync Data", "Do you want to sync data from cloud or redux?", [
            {
                text : "Cloud",
                onPress : () => {
                    // sync data from cloud
                    store.dispatch(myListActions.setData(cloudData?.data))
                }
            },
            {
                text : "Redux",
                onPress : () => {
                    // sync data from redux
                    saveUserDataToCloud(uid, {
                        _data : reduxData
                    });
                }
            }
        ]);
}

function compareData(data1 : any, data2 : any) {
        if (data1.length !== data2.length) return false;
        if (data1 === data2) return true;
        return false;
}