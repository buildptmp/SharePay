import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'

export default function Profilepage({page, navigation}){
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const [userPicture, setUserPicture] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2Fuser-icon.png?alt=media&token=c034dd07-a8b2-4538-9494-9e65f63bdc51"})
    const [userName, setUserName] = useState("")
    const RouteMapping = [
        { routeName: 'AddingSlip', displayText: 'Add Slip'},
    ]

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setReady(true);
                // console.log(user.photoURL)
                setUserPicture({uri:user.photoURL})
                setUserName(user.displayName)
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
            <Image style={{borderRadius: 500,height:250, width:250 }} source={userPicture}/>
            <Text style={Styles.sectionHeader}>{userName}</Text>
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
            <TouchableOpacity
                style={Styles.btn}
                // onPress={() => {navigation.navigate('PersonalProfilePage')}}
            >
                <Text style={Styles.text}>View user profile</Text>
            </TouchableOpacity> 
            <TouchableOpacity
                style={Styles.btn}
                // onPress={() => {navigation.navigate('PersonalNotificationPage')}}
            >
                <Text style={Styles.text}>VIew notification</Text>
            </TouchableOpacity> 
            <Text style={[Styles.sectionHeaderwithsub,{alignSelf:'flex-start'}]}>Creditor List</Text>
            <Text style={[Styles.sectionHeaderwithsub,{alignSelf:'flex-start'}]}>Debtor List</Text>
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

