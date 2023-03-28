import React, { useEffect } from "react";
import {
    Text, 
    View, 
    Image,
    TouchableOpacity,
 } from "react-native";
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth';
import { sendPersonalDebtReminder } from '../../database/DBConnection';

export default function UserSelect({ navigation }) {
    const RouteMapping = [
        //{ routeName: 'Login', displayText: 'Log in', },
        { routeName: 'Register', displayText: 'Register / Log in', },
    ]
    let sendOneTime = true

    function onAuthStateChanged(user) {
        if (user) {
            setInterval(async ()=>{
                const time = new Date(Date.now());
                if(time.toLocaleString().split(", ")[1] == "7:00:00 AM"){
                // if(time.toLocaleString().split(", ")[1] == "2:31:40 PM"){
                    if(sendOneTime){
                        sendOneTime = false
                        await sendPersonalDebtReminder(user.uid)
                        console.log("Sent debt reminder.")
                    }
                }
                else{
                  console.log(time.toLocaleString())
                }
            },1000)
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