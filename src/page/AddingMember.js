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
 import auth from '@react-native-firebase/auth';
 import { getUserFromPhoneNum, addEditGroupMember, isInGroup} from "../../database/DBConnection";

 export default function AddingMember({ route, navigation }) {
    console.log("AddingMember Page")
    const [PhoneNum, setPhoneNum] = useState("");
    const [member, setMember] = useState({});
    const [showUser, setshowUser] = useState(false);
    const [isNotNewuser, setIsNotNewuser] = useState(false);
    const { gid , gname} = route.params

    async function checkMember(){
        const m = await getUserFromPhoneNum(PhoneNum)
        if(m.length != 0){
            const memberInfo = m[0]
            setMember(memberInfo)
            setshowUser(true)
            setIsNotNewuser(true)
        }
        else{
            setIsNotNewuser(false)
        }
}
    // console.log(gid)
    useEffect(() =>{
        console.log(PhoneNum)
        if(PhoneNum.length == 10){
            checkMember()
        }
    },[PhoneNum])

    async function _addMember(){
        if(Object.keys(member).length > 0){
            const check = await isInGroup(gid,member.uid)
            if(check.isInGroup || check.status !=  undefined){
                check.status == 'accepted' ? alert('This user is already in the group '+ gname) : alert('Invitation status is ' + check.status)
            }
            else{
                console.log("not in group")
                addEditGroupMember(gid,member.uid,'pending')
                alert("Invitaion has been sent to "+member.name)
            }
        }
        else{
            alert('Can not find an account with phone number '+ PhoneNum)
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.containerAddmem}>
            {showUser &&
                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    marginBottom: 20,
                    borderColor: 'black',
                    borderWidth: 0.5
                }}>
                {isNotNewuser ? (
                    <View>
                        <Image source = {{uri:member.userImage}} style={{width: 200, height: 200, paddingBottom: 10}}/>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{member.name}</Text>
                        <Text style={{ color: 'pink', fontSize: 12 }}>{member.bio}</Text>
                    </View>
                    ): <Text style={{ color: 'black', fontSize: 18}}>Can not find the account</Text>
                }
                </View>
            }
            <View style={[{ width: '120%', paddingHorizontal: 100}]}>
                <Text style={[{fontWeight:'bold', marginLeft:10}]}> Phone Number </Text>
                <TextInput
                    style={Styles.inputAddmem}
                    value={PhoneNum}
                    placeholder={"Insert Phone Number"}
                    onChangeText={(text) => setPhoneNum(text)}
                    autoCapitalize={"none"}
                />
                <TouchableOpacity style={Styles.btnph}  onPress={_addMember}>
                    <Text style={Styles.text}> Add Member</Text>
                </TouchableOpacity>
            </View> 
            </View>
        </SafeAreaView>
    );
};