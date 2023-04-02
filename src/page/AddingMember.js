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
    Modal,
    Pressable,
 } from "react-native";
 import auth from '@react-native-firebase/auth';
 import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
 import { getUserFromPhoneNum, getUserFromUid, addEditGroupMember, isInGroup, sendGroupInv, getGroupInv, delGroupInv} from "../../database/DBConnection";

 export default function AddingMember({ route, navigation }) {
    const { gid , gname} = route.params
    const [currentUser, setCurrentUser] = useState("");
    const uid = auth().currentUser?.uid;
    const [PhoneNum, setPhoneNum] = useState("");
    const [member, setMember] = useState("");
    const [showUser, setshowUser] = useState(false);
    const [isNotNewuser, setIsNotNewuser] = useState(false);
    const [checkInGroup, setcheckInGroup] = useState("");
    const [ResendgroupInvModalVisible, setResendgroupInvModalVisible] = useState(false);
    const [ConfiremTodeletePopupModalVisible, setConfiremTodeletePopupModalVisible] = useState(false);
    const [nid_GroupInv, setNid] = useState("")

    async function setCurrUser(){
        const u = await getUserFromUid(uid)
        setCurrentUser(u);
    }
    async function checkMember(){
        const m = await getUserFromPhoneNum(PhoneNum)
        if(m.length != 0){
            const memberInfo = m[0]
            setMember(memberInfo)
            setshowUser(true)
            setIsNotNewuser(true)

            const nid = await getGroupInv(uid,memberInfo.uid);
            setNid(nid)
            
            const check = await isInGroup(gid,memberInfo.uid)
            setcheckInGroup(check);
        }
        else{
            setIsNotNewuser(false)
        }
    }
    // console.log(gid)
    useEffect(() =>{
        if(!currentUser){
            setCurrUser();
        }
        // console.log(PhoneNum)
        if(PhoneNum.length == 10){
            checkMember();
        }
    },[currentUser,PhoneNum,nid_GroupInv])

    const ResendgroupInvPopup = (
        <Modal
            animationType='slide'
            transparent={true}
            visible={ResendgroupInvModalVisible}
            onRequestClose={()=>{
                setResendgroupInvModalVisible(false);
            }}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <View>
                        <Text style={{textAlign:'center', color:'black'}}>The invitation has been declined by {member.name}.</Text>
                        <Text style={{textAlign:'center', color:'black'}}>Would you like to send it again?</Text>
                        <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between', paddingHorizontal:30}}>
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={async ()=>{
                                    await _reAddMember();
                                    setResendgroupInvModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>  Yes  </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={()=>{
                                    setResendgroupInvModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>   No   </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

    const ConfirmTodeletePopup = (
        <Modal
            animationType='slide'
            transparent={true}
            visible={ConfiremTodeletePopupModalVisible}
            onRequestClose={()=>{
                setConfiremTodeletePopupModalVisible(false)
            }}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <View>
                        {/* <Text style={{textAlign:'center'}}>The invitation has been declined by {member.name}.</Text> */}
                        <Text style={{textAlign:'center', color:'black'}}>Please confirm to delect the invitation.</Text>
                        <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between', paddingHorizontal:30}}>
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={async ()=>{
                                    await _removeInv();
                                    setConfiremTodeletePopupModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>  Confirm  </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={()=>{
                                    setConfiremTodeletePopupModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>   Back   </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )

    async function _addMember(){
        if(Object.keys(member).length > 0){
            const check = await isInGroup(gid,member.uid)
            if(check.isInGroup || check.status !=  undefined){
                if(check.status=="declined"){
                    setResendgroupInvModalVisible(true);
                }
                else{
                    check.status == 'accepted' ? alert('This user is already in the group '+ gname+".") : alert('Invitation status is ' + check.status+".")
                }
            }
            else{
                // console.log("not in group")
                const nid = await sendGroupInv(currentUser, member, true, gid, gname).then(async()=>{
                    await addEditGroupMember(gid,member.uid,'pending');
                    alert("Invitaion has been sent to "+member.name+".");
                    setcheckInGroup(check);
                })   
                setNid(nid);
            }
        }
        else{
            alert('Cannot find an account with phone number '+ PhoneNum+".")
        }
    }

    async function _reAddMember(){
        if(Object.keys(member).length > 0 && nid_GroupInv){
            const nid = await sendGroupInv(currentUser, member, true,gid, gname).then(async()=>{
                await addEditGroupMember(gid,member.uid,'pending');
                alert("Invitaion has been sent to "+member.name+".");
            })  
            const check = await isInGroup(gid,member.uid)
            setcheckInGroup(check); 

            setNid(nid);
        }
        else{
            alert('Cannot find an account with phone number '+ PhoneNum+".")
        }
    }

    async function _removeInv(){
        if(Object.keys(member).length > 0 && nid_GroupInv){
            await delGroupInv(nid_GroupInv, gid, member.uid)
            alert("The invitation has been delete.")

            const check = await isInGroup(gid,member.ui)
            setcheckInGroup(check);

            setNid("");
        }
        else{
            alert('Cannot find an account with phone number '+ PhoneNum+"."+nid_GroupInv)
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.containerAddmem}>
            <View style={{marginHorizontal:30}}>
                {ResendgroupInvPopup}
                {ConfirmTodeletePopup}
                <Text style={[{fontWeight:'bold', marginLeft:10, color:'black'}]}> Phone Number </Text>
                <View style={{flexDirection: 'row', width: '80%', marginLeft:10}}>
                <TextInput
                    style={Styles.inputAddmem}
                    value={PhoneNum}
                    placeholder={"Insert Phone Number"}
                    placeholderTextColor='grey'
                    onChangeText={(text) => setPhoneNum(text)}
                    autoCapitalize={"none"}
                />
                
                {/* {
                    checkInGroup.status != "pending" && 
                    <TouchableOpacity style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", margin:5, marginLeft:8}} onPress={
                        _addMember}>
                    <FontAwesome
                    name="plus"
                    color="white"
                    size={18}
                    style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                    /></TouchableOpacity>
                } */}
                
                {
                    checkInGroup.status ==  'pending' &&
                    // <View style={{width:50}}>
                        <TouchableOpacity style={{ borderRadius:20, backgroundColor:"#F88C8C", margin:5, marginLeft:10, padding:8}} 
                            onPress={()=>{
                                setConfiremTodeletePopupModalVisible(true)
                            }}
                            >
                        {/* <FontAwesome
                            name="minus"
                            color="white"
                            size={18}
                            style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                            // onPress={_removeInv}
                        /> */}
                        <Text style={{textAlign:'center', color:'white', fontWeight:'bold',textAlignVertical:'center'}}>delete</Text>
                        </TouchableOpacity>
                        
                    // </View>
                }
                
                {/* </TouchableOpacity> */}
                </View> 
            </View> 
            {showUser && 
                <View style={{
                    marginTop:10,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    // paddingTop: 20,
                    borderColor: 'black',
                    borderWidth: 0.5
                }}>
                {isNotNewuser ? (
                    <View>
                        <Image source = {{uri:member.image}} style={{width: 160, height: 160, paddingBottom: 10}}/>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Name: {member.name}</Text>
                        <Text style={{ color: 'pink', fontSize: 12, fontWeight:'bold' }}>Bio: {member.bio}</Text>
                        {member.avgRating == undefined? null:<Text style={{ color: 'pink', fontSize: 12, fontWeight:'bold' }}>Avg rating: {member.avgRating}</Text>}
                        <Pressable 
                            style={[Styles.btnitif_v2, {marginTop:10}]}
                            onPress={_addMember}
                            disabled={checkInGroup.status=="pending"}
                            >
                            <Text style={Styles.text}>{ checkInGroup.status=="pending" ? checkInGroup.status:"Add Member"}</Text>
                        </Pressable>{ checkInGroup.status=="declined" ? <Text style={{color:'grey'}}>status: declined</Text>:null}
                    </View>
                    ): <Text style={{ color: 'black', fontSize: 18}}>Cannot find the account</Text>
                }
                </View>
            }
            
            <TouchableOpacity 
                style={[Styles.btnitif, {position:'absolute', top:500}]}
                onPress={()=>{
                    navigation.goBack();
                    navigation.navigate('Group',{gid:gid})
                    
                }}
                >
                <Text style={Styles.text}> Done </Text>
            </TouchableOpacity>
            {/* <View style={[{ width: '120%', paddingHorizontal: 100}]}>
                <Text style={[{fontWeight:'bold', marginLeft:10}]}> Phone Number </Text>
                <TextInput
                    style={Styles.inputAddmem}
                    value={PhoneNum}
                    placeholder={"Insert Phone Number"}
                    placeholderTextColor='grey'
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
