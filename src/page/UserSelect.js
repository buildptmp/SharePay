import React, { useEffect, useState} from "react";
import { NavigationScreenProps } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useHistory } from "react-router-dom";
import { Button, 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";
import { Styles } from "../Styles"
import Login from '../page/Login';
import UserRegister from '../page/UserRegister';

export default function UserSelect({ navigation }) {
    const RouteMapping = [
        { routeName: 'Login', displayText: 'Log in', },
        { routeName: 'UserRegister', displayText: 'Register', },
    ]

    return(
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={require('../assets/Logo.png')} 
            />   
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
                {RouteMapping.map((e) => {
                    return (
                        <TouchableOpacity 
                            key={e.routeName}
                            style={Styles.btn}
                            onPress={() => navigation.navigate(e.routeName)}
                        >
                            <Text style={Styles.text}>{e.displayText}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    
    )
}