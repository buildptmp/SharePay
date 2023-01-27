import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth';

export default function UserInformation({ navigation }) {
    const [name, setName] = useState(null);

    function _setDisplayName() {
        auth().currentUser.updateProfile({
            displayName: name
        }).then(() => navigation.navigate('Homepage'));
    }

    return(

        <View style={Styles.containerRegis}>
            <TextInput 
                style={Styles.input}
                value={name}
                placeholder={"Display Name"}
                onChangeText={(text) => setName(text)}
            /> 
            <TouchableOpacity
                style={Styles.btn}
                onPress={_setDisplayName}
            >
                <Text style={Styles.text}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};