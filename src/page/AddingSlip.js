import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { useHistory } from "react-router-dom";
// import { createStackNavigator } from '@react-navigation/stack';
import Homepage from './Homepage';
import { Styles } from "../Styles"
// import { NavigationScreenProps } from "react-navigation";
import { FC, useEffect, ReactElement, useState } from "react";
import { Button, 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";

 export default function AddingSlip({ navigation }) {
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const [pickerRes, setPickerRes] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2FAddMem.png?alt=media&token=713f3955-809a-47e6-9f4c-4e93ac53dcd9"});
    const RouteMapping = [
        { routeName: 'Add Member', displayText: 'Add Member', }
    ]

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };

    return(
        
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <TouchableOpacity onPress={chooseFile}>
                <Image style = {Styles.image_picker} source={{uri: pickerRes.uri}}></Image>
            </TouchableOpacity>
        
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Group: (wait for data)</Text>
                <Text style={Styles.textboxtop}>From: 'Debtor'</Text>
                <Text style={Styles.textboxtop}>To: 'Creditor' </Text>
                <Text style={Styles.textboxtop}> Amount: 'Price' </Text>
                <TouchableOpacity 
                    // key={e.routeName}
                    style={Styles.btnslip}
                    onPress={()=> alert('Upload Successfully.')}
                >
                    <Text style={Styles.text}> Confirm </Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};

