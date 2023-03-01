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

 export default function ItemInfo({ route,navigation }) {
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const {eid,ename,gid,price } = route.params
    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]

    return(
        
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Item Name: {ename}</Text>
                <Text style={Styles.textboxtop}>Item Price: {price} </Text>
                <Text style={Styles.textboxtop}>Creditor: ' ' </Text>
                <Text style={Styles.textboxtop}> Debtor: ' ' </Text>
                <TouchableOpacity 
                    // key={e.routeName}
                    style={Styles.btnslip}
                   // onPress={() => navigation.navigate('GroupInfo')}
                >

                    <Text style={Styles.text}> Done </Text>
                    
                </TouchableOpacity>
            </View>
        </View> 
    );
};

