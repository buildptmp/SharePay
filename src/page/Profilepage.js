import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorList } from "../../database/DBConnection";

export default function Profilepage({page, navigation}){
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const [userPicture, setUserPicture] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2Fuser-icon.png?alt=media&token=c034dd07-a8b2-4538-9494-9e65f63bdc51"})
    const [userName, setUserName] = useState("");
    const [debtorList, setDebtorList] = useState([{}]);
    const [debtList, setDebtList] = useState([{}]);

    async function _showDebtAndDebtorList(uid){
        const list = await getPersonalDebtAndDebtorList(uid);
        setDebtorList(list[0]);
        setDebtList(list[1]);
        // console.log(list[0][0])
        // console.log(list[1][0])
    }
    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setReady(true);
                _showDebtAndDebtorList(user.uid)
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
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6EFEF'}}>
            <Image style={Styles.image_picker} source={userPicture}/>
            <Text style={Styles.sectionHeader}>{userName}</Text>
            
            <TouchableOpacity
                style={Styles.btnprofile}
                onPress={() => {navigation.navigate('ProfileInfo')}}
            >
                <Text style={Styles.text}>View User Profile</Text>
            </TouchableOpacity> 
            <TouchableOpacity
                style={Styles.btnprofile}
                onPress={() => {navigation.navigate('Notification')}}
            >
                <Text style={Styles.text}>Notification</Text>
            </TouchableOpacity> 
            
             {/* /* <Text style={[Styles.sectionHeaderwithsub,{alignSelf:'flex-start'}]}>Creditor List</Text>
            <Text style={[Styles.sectionHeaderwithsub,{alignSelf:'flex-start'}]}>Debtor List</Text> */ }
            
            { curUser && 
                <TouchableOpacity
                    style={Styles.btnlogout}
                    onPress={_signOut}
                >
                    <Text style={Styles.text}>Logout</Text>
                </TouchableOpacity> 
            }
        </View>
    );
}

