import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useHistory } from "react-router-dom";
import { createStackNavigator } from '@react-navigation/stack';
import Homepage from './Homepage';
import { Styles } from "../Styles"
import { NavigationScreenProps } from "react-navigation";
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

 export default function GroupCreate({ navigation }) {
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
                                // key={e.routeName}
                                style={Styles.btn}
                                onPress={()=> alert('Upload Successfully')}

                            >
                                <Text style={Styles.text}> Confirm </Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};

