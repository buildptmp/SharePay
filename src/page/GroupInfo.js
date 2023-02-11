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
    SectionList,
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";
 import auth from '@react-native-firebase/auth';
 import Icon from 'react-native-vector-icons/FontAwesome';
 import { getMemberListByGid, getExpenseListByGid } from '../../database/DBConnection'

 export default function GroupInfo({ route, navigation }) {
    const { gid , gname} = route.params
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const [memberList, setMemberList] = useState([{}]);
    const [expenseList, setExpenseList] = useState([{}]);

    const RouteMapping = [
        { routeName: 'AddingExpense', displayText: 'Add Expense', }
    ]

    async function _showMemberList(){
        let mList = await getMemberListByGid(gid);
        setMemberList(mList)
        // console.log(mList)
    };

    async function _showExpenseList(){
        let eList = await getExpenseListByGid(gid);
        setExpenseList(eList)
        // console.log(eList)
    };

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setReady(true);
                _showMemberList();
                _showExpenseList();
            } else {
                setUser(null);
                setReady(false);
            }
        });
        // console.log(curUser)
    }, [curUser])

    return(
        // <View style={Styles.containerginfo}>
        <SafeAreaView style={Styles.list_container}>
            <View style={{flexDirection:'row', paddingTop:10}}>
                <Text style={Styles.sectionHeader}>Expense item</Text>
                <Icon
                    name="plus"
                    color="#F88C8C"
                    size={30}
                    // style={{marginTop: 2, marginLeft: 275}}
                    onPress={() => navigation.navigate('AddingExpense', {gid:gid, gname:gname})}>
                </Icon>
            </View>
            <SectionList
            sections={[
                {title: 'Expense item', data: expenseList}
            ]}
            renderItem={({item, index}) => 
                <TouchableOpacity style ={{flex: 1}} onPress={() => 
                    console.log(item.name)
                    // navigation.navigate('ItemInfo',{eid:item.eid, ename:item.name})
                }>
                    <View style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderColor: '#7E828A',
                        flexDirection: 'row'
                        }}>
                        <Text style={Styles.item}>{index + 1}</Text>
                        <Text style={Styles.item}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            }
            // renderSectionHeader={({section}) => ( 
            //     <Text style={Styles.sectionHeader}>{section.title}
            //     <Text style={{paddingLeft: 50}}/>
            //     <Icon
            //         name="plus"
            //         color="#F88C8C"
            //         size={30}
            //         style={{alignSelf:'flex-end', direction:'rtl'}}
            //         onPress={() => navigation.navigate('AddingExpense', {gid:gid, gname:gname})}>
            //     </Icon></Text>
            // )}
            keyExtractor={(item, index) => item + index}
        />
        <View style={{flexDirection:'row', paddingTop:10}}>
            <Text style={Styles.sectionHeader}>Member</Text>
            <Icon
                name="plus"
                color="#F88C8C"
                size={30}
                // style={{marginTop: 2, marginLeft: 275}}
                onPress={() => navigation.navigate('AddingMember', {gid:gid, gname:gname})}>
            </Icon>
        </View>
        <SectionList
            sections={[
                {title: 'Member', data: memberList}
            ]}
            renderItem={({item}) => 
                <TouchableOpacity style ={{flex: 1}} onPress={() => 
                    console.log(item.name)
                    // navigation.navigate('Profile')
                }>
                    <View style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderColor: '#7E828A',
                        flexDirection: 'row'
                        }}>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/>
                        <Text style={Styles.item}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            }
            // renderSectionHeader={({section}) => ( 
            //     <Text style={Styles.sectionHeader}>{section.title}
            //     <Icon
            //         name="plus"
            //         color="#F88C8C"
            //         size={30}
            //         style={{alignSelf:'flex-end', direction:'rtl'}}
            //         onPress={() => navigation.navigate('AddingMember', {gid:gid, gname:gname})}>
            //     </Icon></Text>
            // )}
            keyExtractor={(item, index) => item + index}
        /></SafeAreaView>
        // </View>
    );
};

