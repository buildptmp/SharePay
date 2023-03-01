import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Styles } from "../Styles"
import { getGroupListByUid } from "../../database/DBConnection";
import { ListItem } from "react-native-elements";

export default function Homepage({page, navigation}){
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const [groupList, setGroupList] = useState([{}]);

    const RouteMapping = [
        { routeName: 'GroupInfo', displayText: 'Group Info'},
    ]

    async function _showGroupList(){
        let gList = await getGroupListByUid(auth().currentUser.uid);
        setGroupList(gList)
    };
    
    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setReady(true);
                _showGroupList();
            } else {
                setUser(null);
                setReady(false);
            }
        });
    }, [curUser])

    return(
        <SafeAreaView style={Styles.list_container}>
            {groupList && <SectionList
                sections={[
                    {title: 'Group', data: groupList},
                ]}
                renderItem={({item}) => 
                    <TouchableOpacity key={'GroupInfo'} style ={{flex: 1}} onPress={() => 
                        navigation.navigate('GroupInfo',{gid:item.gid})
                    }>
                        <View style={{
                            // width: '100%',
                            // height: 50,
                            paddingVertical:3,
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
                renderSectionHeader={({section}) => (
                    <Text style={Styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
            />}
        </SafeAreaView>
    );
}