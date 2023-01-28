import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Styles } from "../Styles"

export default function Homepage({page, navigation}){
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    

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
            <Text 
                onPress={()=> alert('This is "homepage"')}
                style={{ fontSize: 26, fontWeight:'bold'}}> 
                Home Page
            </Text>
            { isReady && 
                <Text>
                    Test! Welcome { curUser ? curUser.displayName : '' }
                </Text>
            }

            { curUser && 
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={_signOut}
                >
                    <Text>Logout</Text>
                </TouchableOpacity> 
            }

        </View>
    );
}