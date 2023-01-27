import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import { Styles } from "../Styles"
import SelectDropdown from 'react-native-select-dropdown'
import auth from '@react-native-firebase/auth';

export default function UserRegister({ navigation }) {
    const [phoneNum, setPhoneNum] = useState(null);
    const [countryCode, setCountryCode] = useState('+66');
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const countriesCode = ["+66", "+65"]

    function onAuthStateChanged(user) {
        if (user) {
            navigation.navigate('UserInformation');
        }
    }
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Handle the button press
    async function signInWithPhoneNumber() {
        const phoneNumber = countryCode + phoneNum
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
        await confirm.confirm(code);
        } catch (error) {
        console.log('Invalid code.');
        }
    }
    
    return(

        <View style={Styles.containerRegis}>

            <Text>Phone Number</Text>
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <SelectDropdown
                    defaultValue={countryCode}
                    data={countriesCode}
                    onSelect={(selectedItem) => {
                        setCountryCode(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item) => {
                        return item
                    }}
                    buttonStyle={Styles.dropDownBtnStyle}
                />
                <TextInput
                    style={Styles.input}
                    value={phoneNum}
                    placeholder={"Insert Phone Number"}
                    onChangeText={(text) => setPhoneNum(text)}
                />
            </View>
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={signInWithPhoneNumber}
                >
                    <Text style={Styles.text}>Request OTP</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                style={Styles.input}
                value={code}
                placeholder={"Sent OTP"}
                onChangeText={(text) => setCode(text)}
            /> 
            <TouchableOpacity
                style={Styles.btn}
                onPress={confirmCode}
            >
                <Text style={Styles.text}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};