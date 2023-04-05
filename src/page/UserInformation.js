import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image } from "react-native";
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth';
import { updateUser } from "../../database/DBConnection";
import { uploadProfile, imagePicker } from '../../database/Storage'

export default function UserInformation({ navigation }) {
    const user = auth().currentUser;
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [pickerRes, setPickerRes] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2Fuser-icon.png?alt=media&token=c034dd07-a8b2-4538-9494-9e65f63bdc51"})
    
    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel && !response.error){
            // console.log("Adding Slip",response)
            setPickerRes(response.assets[0])
        }
    };

    async function _setUerProfile() {
        const photoURL = (pickerRes.fileName != undefined ? await uploadProfile(pickerRes.fileName,pickerRes.uri,pickerRes.type):pickerRes.uri)
        auth().currentUser.updateProfile({
            displayName: name,
            photoURL: photoURL
        });
        updateUser(user.uid,name,photoURL,bio)
        alert("Successfully saved.")
        navigation.navigate('Root');
    }

    return(

        <View style={Styles.containerRegis}>
            <TouchableOpacity
                onPress={chooseFile}
                style={{flex:0.8}}
            >
                <Image source={{uri:pickerRes.uri}} style={Styles.image_picker}></Image>
                <Text style={{color: "#9e9e9e", alignSelf:'center'}}>Change Profile Picture</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', backgroundColor: '#F6EFEF', padding:70}}>
                <TextInput 
                    style={Styles.inputgroup}
                    value={name}
                    placeholder={"Display Name"}
                    placeholderTextColor='grey'
                    onChangeText={(text) => setName(text)}
                /> 
                <TextInput 
                    style={Styles.inputgroup}
                    value={bio}
                    placeholder={"Your bio is optional."}
                    placeholderTextColor='grey'
                    onChangeText={(text) => setBio(text)}
                /> 
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={_setUerProfile}
                >
                    <Text style={Styles.text}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};