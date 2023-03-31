import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import {launchImageLibrary } from 'react-native-image-picker'

export async function uploadProfile(fileName, file, type){
    const reference = storage().ref("/profile picture/"+fileName);
    // uploads file
    const task = reference.putFile(file);

    task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
    task.then(() => {
        console.log('Image uploaded to the bucket!');
    });
    const url = task.then( async () => {
        const url = await reference.getDownloadURL()
        return url
    })
    return url
}

export async function uploadGroupImg(fileName, file, type){
    const reference = storage().ref("/group picture/"+fileName);
    // uploads file
    const task = reference.putFile(file);

    task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
    task.then(() => {
        console.log('Image uploaded to the bucket!');
    });
    const url = task.then( async () => {
        const url = await reference.getDownloadURL()
        return url
    })
    return url
}

export async function uploadSlip(fileName, file, type, oldSlipURL=""){
    if(oldSlipURL){
        storage().refFromURL(oldSlipURL).delete();
    }
    const reference = storage().ref("/slip/"+fileName);
    // uploads file
    const task = reference.putFile(file);

    task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
    task.then(() => {
        console.log('Image uploaded to the bucket!');
    });
    const url = task.then( async () => {
        const url = await reference.getDownloadURL()
        return url
    }).catch(error=>{return false})
    return url
}

export async function imagePicker(){
    // var options = {
    //     title: 'Select Image',
    //     storageOptions: {
    //         skipBackup: true, // do not backup to iCloud
    //         path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
    //     },
    // };
    const response = await launchImageLibrary({},(response) => {
        // console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled image picker', storage());
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            const res = response.assets[0]
            // console.log( "Response picker = ",res)
            return  res
        }
        console.log( "Response = ",response)
        return response
    });
    return response
};

