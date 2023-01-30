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
    const [PhoneNum, setPhoneNum] = useState(null);
    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]

    return(
        
        <View style={Styles.containerAddmem}>
            <View style={[{ width: '120%', paddingHorizontal: 100}]}>
                <Text style={[{fontWeight:'bold', marginLeft:10}]}> Phone Number </Text>
                <TextInput
                style={Styles.inputAddmem}
                value={PhoneNum}
                placeholder={"Insert Phone Number"}
                onChangeText={(text) => setPhoneNum(text)}
                autoCapitalize={"none"}
                />
                <TouchableOpacity style={Styles.btnph}  onPress={()=> alert('Adding member successful!')}>
                    <Text style={Styles.text}> Add Member</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};