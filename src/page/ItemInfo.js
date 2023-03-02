import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import Homepage from './Homepage';
import { Styles } from "../Styles"
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
import { getExpenseInfo } from "../../database/DBConnection";

export default function ItemInfo({ route,navigation }) {
    const {eid,ename,gid,price } = route.params;
    const [itemInfo, setItemInfo] = useState({});
    const RouteMapping = [
        { routeName: 'Homepage', displayText: 'Homepage', }
    ]

    async function showItemInfo(){
        const item = await getExpenseInfo(gid,eid);
        console.log(item);
        setItemInfo(item);
    }
    useEffect(()=>{
        showItemInfo()
    },[])
    return(
        
        <View style={Styles.container}>
            {/* <View style={[{flex:1}]} /> */}
            <View style={[{ marginHorizontal: 20, backgroundColor: '#F6EFEF'}]}>
                <Text style={{fontSize:12}}>Item Name: {ename} </Text>
                <Text style={{fontSize:12}}>Item Price: {price} </Text>
                <Text style={{fontSize:12}}>Creditor: {JSON.stringify(itemInfo.creditor)} </Text>
                <Text style={{fontSize:12}}> Debtor: {JSON.stringify(itemInfo.debtor)} </Text>
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

