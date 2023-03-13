import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef} from "react";
import { Button, 
    StyleSheet, 
    SectionList,
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";

 export default function Notification({ navigation }) {
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]

    return(
        
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={require('../assets/AddMem.png')} 
            />
        
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Group: (wait for data)</Text>
                <Text style={Styles.textboxtop}>From: 'Debtor'</Text>
                <Text style={Styles.textboxtop}>To: 'Creditor' </Text>
                <Text style={Styles.textboxtop}> Amount: 'Price' </Text>
                <TouchableOpacity 
                    style={Styles.btnslip}
                    onPress={()=> alert('Upload Successfully.')}
                >
                    <Text style={Styles.text}> Confirm </Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};