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

 export default function GroupInfo({ route, navigation }) {
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const { gid , gname} = route.params
    const RouteMapping = [
        { routeName: 'AddingExpense', displayText: 'Add Expense', }
    ]

    return(
        <View style={Styles.container}>
            
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <TouchableOpacity 
                    // key={e.routeName}
                    style={Styles.btn}
                    onPress={() => navigation.navigate('AddingExpense')}
                >
                    <Text style={Styles.text}> Add Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    // key={e.routeName}
                    style={Styles.btn}
                    onPress={() => navigation.navigate('AddingMember', {gid:gid, gname:gname})}
                >
                    <Text style={Styles.text}> Add Member</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};

