import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef } from "react";
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
//  import CheckBox from 'react-native-check-box';
import SectionList from 'react-native/Libraries/Lists/SectionList';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Fontisto';
// import Icon from 'react-native-vector-icons/AntDesign';
import {addExpense, addDebtor, getMemberListByGid} from '../../database/DBConnection'

export default function UserInputNumber() {
    const [member, setmember] = useState(null);
    // const methods = ["Split Equally", "Input a price myself", "Percentage Share"]
    return(
        // <SafeAreaView style={Styles.list_container, {width:"100%"}}><SectionList
        //     sections={[
        //         {title: 'Select the debtor', data: memberList},
        //     ]}
        //     renderItem={({item, index}) => 
        //         <TouchableOpacity style ={{flex: 1}} defaultValue={{uid:item.uid}} onPress={() => handleChange(item.uid)}>
        //             <View style={{
        //                 width: '100%',
        //                 height: 50,
        //                 backgroundColor: '#FFFFFF',
        //                 borderBottomWidth: 1,
        //                 borderColor: '#7E828A',
        //                 flexDirection: 'row'
        //                 }}>
        //                 <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/>
        //                 <Text style={Styles.item}>{item.name}</Text>
        //             </View>
        //         </TouchableOpacity>
        //     }
        //     keyExtractor={(item, index) => item + index}
        // /></SafeAreaView>
        <Text>User Input number</Text>
    );
};