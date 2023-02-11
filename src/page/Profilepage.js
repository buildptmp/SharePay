import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'

export default function Profilepage({page, navigation}){
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const RouteMapping = [
        { routeName: 'AddingSlip', displayText: 'Add Slip'},
    ]
    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setReady(true);
            } else {
                setUser(null);
                setReady(false);
            }
        });
        // console.log(curUser)
    }, [curUser])

    function _signOut() {
        auth()
            .signOut()
            .then(() => navigation.navigate('UserSelect'))
    }
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
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
            { curUser && 
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={_signOut}
                >
                    <Text style={Styles.text}>Logout</Text>
                </TouchableOpacity> 
            }
        </View>
    );
}

