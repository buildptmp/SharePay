import React, { useState, useEffect, useRef, useCallback, focus} from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { uploadProfile, imagePicker } from '../../database/Storage'
import { updateUser, getUserFromUid} from '../../database/DBConnection'

export default function ProfileInfo({page, navigation}){
const user = auth().currentUser
const phoneNum = user.phoneNumber;

const [userInfo, setUserInfo] = useState([{}]);
const [pickerRes, setPickerRes] = useState({uri:user.photoURL});
const [displayName, setDisplayName] = useState("");
const [bio, setBio] = useState("")

const textInputRefname = useRef(null);
const textInputRefbio = useRef(null);

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };
    
    editName = () => {
        textInputRefname.current.focus(); 
    };

    editBio = () => {
        textInputRefbio.current.focus(); 
    };

    async function getUserInfo(){
        const oldUserInfo = await getUserFromUid(user.uid)
        setUserInfo(oldUserInfo)
        setDisplayName(oldUserInfo.name)
        setBio(oldUserInfo.bio)
    };
    useState(()=>{
        getUserInfo() 
    },[pickerRes])

    async function _saveEdit(){
        const photoURL = (pickerRes.fileName != undefined ? await uploadProfile(pickerRes.fileName,pickerRes.uri,pickerRes.type):pickerRes.uri)
        auth().currentUser.updateProfile({
            displayName: displayName,
            photoURL: photoURL
        });
        updateUser(user.uid,displayName,photoURL,bio)
        alert("Successfully changed profile.");
        getUserInfo();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={Styles.image_picker} source={{uri:pickerRes.uri}}/>
                <TextInput ref={textInputRefname} style={Styles.sectionHeader} onChangeText={(text) => setDisplayName(text)}>{displayName}</TextInput>
                <TextInput ref={textInputRefbio} style={Styles.sectionHeader} onChangeText={(text) => setBio(text)}>{bio}</TextInput>
                <Text style={Styles.sectionHeader}>{phoneNum}</Text>
                <View style={{width: '80%',margin: 2}} >
                    <Button title={'Change profile picture'} onPress={chooseFile}></Button>
                    <Button title={'Change display name'} onPress={editName}></Button>
                    <Button title={'Change bio'} onPress={editBio}></Button>
                    <Button title={'Save change'} onPress={_saveEdit}></Button>
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#e6e6fa',
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
});