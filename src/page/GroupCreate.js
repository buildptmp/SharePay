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
import { addGroup, addEditGroupMember } from "../../database/DBConnection";
// import AddingMember from "./AddingMember";
 
 export default function GroupCreate({ navigation }) {
    const [GroupName, setGroupName] = useState("");
    const [GroupDesc, setGroupDesc] = useState("");
    const [photoURL, setPhotoURL] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2FAddMem.png?alt=media&token=713f3955-809a-47e6-9f4c-4e93ac53dcd9"})
    // let RouteMapping = [
    //     { routeName: 'AddingMember', componant: AddingMember}
    // ]
    // const navi = useNavigation();
    async function _createGroup() {
        if(GroupName==""){
            alert("what is your group name?");
        }
        else{
            const user = auth().currentUser;
            const groupId = await addGroup(GroupName, photoURL.uri, GroupDesc);
            addEditGroupMember(groupId,user.uid,'accepted')
            
            navigation.navigate('AddingMember',{gid:groupId, gname:GroupName})
            // console.log(RouteMapping)
            // navigation.navigate('AddingMember');
        }
    }

    return(
        
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={require('../assets/AddMem.png')} 
            />
        
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Group Name</Text>
                <TextInput
                style={Styles.inputgroup}
                value={GroupName}
                placeholder={"Insert Group Name"}
                onChangeText={(text) => setGroupName(text)}
                autoCapitalize={"none"}
                />
                <Text style={Styles.textboxtop}>Group Description</Text>
                <TextInput
                style={Styles.descinput}
                value={GroupDesc}
                placeholder={"(Optional)"}
                onChangeText={(text) => setGroupDesc(text)}
                autoCapitalize={"none"}
                />
                <TouchableOpacity 
                    // key={e.routeName}
                    style={Styles.btn}
                    onPress={_createGroup}
                >
                    <Text style={Styles.text}> Create Group</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};

