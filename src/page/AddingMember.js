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
    const [modalVisible, setModalVisible] = useState(false);
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

    const Popup = (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={()=>{
                setModalVisible(false);
            }}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <View>
                        <Text style={{textAlign:'center'}}>The invitation has been declined by {member.name}.</Text>
                        <Text style={{textAlign:'center'}}>Would you like to send the it again?</Text>
                        <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between', paddingHorizontal:30}}>
                            {/* <View style={{flexDirection:'row', borderWidth:1,alignItems:'flex-start'}}> */}
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={async ()=>{
                                    // setIsAccept(false);
                                    await _reAddMember();
                                    setModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>   No   </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={Styles.btnpopup}
                                onPress={()=>{
                                    // setIsAccept(false);
                                    setModalVisible(false);
                                }} 
                            >
                                <Text style={Styles.text}>  Yes  </Text>
                            </TouchableOpacity>
                            {/* </View>     */}
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
                    setModalVisible(true);
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
            alert('Can not find an account with phone number '+ PhoneNum+".")
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
            alert('Can not find an account with phone number '+ PhoneNum+".")
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
            
            alert('Can not find an account with phone number '+ PhoneNum+"."+nid_GroupInv)
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={Styles.containerAddmem}>
            <View style={{marginHorizontal:30}}>
                {Popup}
                <Text style={[{fontWeight:'bold', marginLeft:10}]}> Phone Number </Text>
                <View style={{flexDirection: 'row', width: '80%', marginLeft:10}}>
                <TextInput
                    style={Styles.inputAddmem}
                    value={PhoneNum}
                    placeholder={"Insert Phone Number"}
                    onChangeText={(text) => setPhoneNum(text)}
                    autoCapitalize={"none"}
                />
                <TouchableOpacity style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", margin:5, marginLeft:8}} onPress={
                    _addMember}>
                <FontAwesome
                    name="plus"
                    color="white"
                    size={18}
                    style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                    />
                </TouchableOpacity>
                {
                    checkInGroup.status ==  'pending' &&
                    <TouchableOpacity style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", margin:5, marginLeft:10}} 
                        onPress={_removeInv}
                        >
                    <FontAwesome
                        name="minus"
                        color="white"
                        size={18}
                        style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                        // onPress={_removeInv}
                    />
                    </TouchableOpacity>
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
                        <TouchableOpacity 
                            style={[Styles.btnitif_v2, {marginTop:10}]}
                            onPress={_addMember}
                            >
                            <Text style={Styles.text}>Add Member</Text>
                        </TouchableOpacity>
                    </View>
                    ): <Text style={{ color: 'black', fontSize: 18}}>Can not find the account</Text>
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
