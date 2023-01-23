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
        
        <View style={Styles.container}>
            <View style={[{ width: '120%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <TextInput
                style={Styles.input}
                value={PhoneNum}
                placeholder={"Insert Phone Number"}
                onChangeText={(text) => setPhoneNum(text)}
                autoCapitalize={"none"}
                />
                <TouchableOpacity style={Styles.btnph}  onPress={() => navigation.navigate('AddingMember')}>
                    <Text style={Styles.text}> Add Member</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};