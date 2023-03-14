import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef} from "react";
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
 
 const Noti =() => {
    const data = [
        {
            ID: '01',
            Username: 'Bilkin',
            NotiType: ' still have debt in "xxxx" Group',
            Time: '12.00',
        },
        {
            ID: '02',
            Username: 'Jino',
            NotiType: 'User A has invited you to join "XXXX" Group',
            Time: '16.40',
        },
        {
            ID: '03',
            Username: 'Capybara',
            NotiType: 'User A has paid the debt to you',
            Time: '12.00',
        },
        {
            ID: '04',
            Username: 'PP',
            NotiType: 'All expense in "XXXX" group are paid',
            Time: '12.00',
        },
        {
            ID: '05',
            Username: 'Kim',
            NotiType: 'Still have the debt',
            Time: '12.00',
        },
    ]
 }

 export default function Notification({ navigation }) {
    // const [GroupName, setGroupName] = useState(null);
    // const [GroupDesc, setGroupDesc] = useState(null);
    // const RouteMapping = [
    //     { routeName: 'AddingMember', displayText: 'Add Member', }
    // ];
    
        const data = [
            {
                ID: '01',
                Username: 'Bilkin',
                NotiType: ' still have debt in "xxxx" Group',
                Time: '12.00',
            },
            {
                ID: '02',
                Username: 'Jino',
                NotiType: 'User A has invited you to join "XXXX" Group',
                Time: '16.40',
            },
            {
                ID: '03',
                Username: 'Capybara',
                NotiType: 'User A has paid the debt to you',
                Time: '12.00',
            },
            {
                ID: '04',
                Username: 'PP',
                NotiType: 'All expense in "XXXX" group are paid',
                Time: '12.00',
            },
            {
                ID: '05',
                Username: 'Kim',
                NotiType: 'Still have the debt',
                Time: '12.00',
            },
        ]
     
    return(
        <View>
            <FlatList
                data={data}
                keyExtractor={(item, index)=> {
                    return index.toString();
                }}
                renderItem={({item})=>{
                    return (
                        <View style={Styles.list_container}>
                            <View>
                                <Text> {item.Username} </Text>
                            </View>
            
                        </View>
                    )
                }}>
            </FlatList>
        </View>
       
    );
};