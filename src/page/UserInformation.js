import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image } from "react-native";
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth';
import { updateUser } from "../../database/DBConnection";

export default function UserInformation({ navigation }) {
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2Fuser-icon.png?alt=media&token=c034dd07-a8b2-4538-9494-9e65f63bdc51"})

    function _setUerProfile() {
        auth().currentUser.updateProfile({
            displayName: name,
            photoURL: photoURL.uri
        });
        const user = auth().currentUser;
        updateUser(uid=user.uid,displayName=name,userImage=photoURL.uri)
        navigation.navigate('Root');
    }

    return(

        <View style={Styles.containerRegis}>
            <Image source={photoURL} style={{width: 200, height: 200 }}></Image>
            <Text style={{color: "#9e9e9e", paddingBottom: 10}}>change Profile Picture</Text>
            <TextInput 
                style={Styles.input}
                value={name}
                placeholder={"Display Name"}
                onChangeText={(text) => setName(text)}
            /> 
            <TouchableOpacity
                style={Styles.btn}
                onPress={_setUerProfile}
            >
                <Text style={Styles.text}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};