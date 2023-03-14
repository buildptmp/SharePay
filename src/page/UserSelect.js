import React, { useEffect } from "react";
import {
    Text, 
    View, 
    Image,
    TouchableOpacity,
 } from "react-native";
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth';

export default function UserSelect({ navigation }) {
    const RouteMapping = [
        //{ routeName: 'Login', displayText: 'Log in', },
        { routeName: 'Register', displayText: 'Register / Log in', },
    ]

    function onAuthStateChanged(user) {
        if (user) {
            navigation.navigate('Root');
        }
    }
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return(
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={{uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2FLogo.png?alt=media&token=40b8c923-1f01-4b69-942e-748cc8f03475"}} 
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