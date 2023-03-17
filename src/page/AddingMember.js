import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Styles } from "../Styles"
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
 import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
 import { getUserFromPhoneNum, addEditGroupMember, isInGroup} from "../../database/DBConnection";

 export default function AddingMember({ route, navigation }) {
    const { gid , gname} = route.params
    const [PhoneNum, setPhoneNum] = useState("");
    const [member, setMember] = useState({});
    const [showUser, setshowUser] = useState(false);
    const [isNotNewuser, setIsNotNewuser] = useState(false);
    
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
        // console.log(PhoneNum)
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
            <View style={{marginHorizontal:10}}>
                <Text style={[{fontWeight:'bold', marginLeft:10}]}> Phone Number </Text>
                <View style={{flexDirection: 'row', width: '80%'}}>
                <TextInput
                    style={Styles.inputAddmem}
                    value={PhoneNum}
                    placeholder={"Insert Phone Number"}
                    onChangeText={(text) => setPhoneNum(text)}
                    autoCapitalize={"none"}
                />
                <TouchableOpacity style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", margin:3, marginLeft:10}} onPress={
                    _addMember}>
                <FontAwesome
                    name="plus"
                    color="white"
                    size={18}
                    style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                    onPress={_addMember}
                    />
                </TouchableOpacity>
                </View> 
            </View> 
            {showUser &&
                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginTop: 20,
                    borderColor: 'black',
                    borderWidth: 0.5
                }}>
                {isNotNewuser ? (
                    <View>
                        <Image source = {{uri:member.image}} style={{width: 160, height: 160, paddingBottom: 10}}/>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{member.name}</Text>
                        <Text style={{ color: 'pink', fontSize: 12 }}>{member.bio}</Text>
                    </View>
                    ): <Text style={{ color: 'black', fontSize: 18}}>Can not find the account</Text>
                }
                </View>
            }
            <TouchableOpacity 
                    style={[Styles.btnitif, {marginTop:10}]}
                    onPress={()=>{navigation.navigate('Group', {gid:gid, gname:gname})}}
                    >
                    <Text style={Styles.text}> Done </Text>
                </TouchableOpacity>
            {/* <View style={[{ width: '120%', paddingHorizontal: 100}]}>
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
            </View> */}
            </View>
        </SafeAreaView>
    );
};
