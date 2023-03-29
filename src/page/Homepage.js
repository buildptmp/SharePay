import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, SectionList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Styles } from "../Styles"
import { getGroupListByUid } from "../../database/DBConnection";
import { ListItem } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable } from "react-native";
import { sendDebtClearNoti, sendPaidDebtNoti } from "../../database/DBConnection";

export default function Homepage({page, navigation, route}){
    const [curUser, setUser] = useState(null);
    const [groupList, setGroupList] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const RouteMapping = [
        { routeName: 'GroupInfo', displayText: 'Group Info'},
    ]

    async function _showGroupList(uid){
        let gList = await getGroupListByUid(uid);
        setGroupList(gList)

    };
    useFocusEffect(
        React.useCallback(() => {
            auth().onAuthStateChanged( (user) => {
                if (user) {
                    setUser(user);
                    _showGroupList(user.uid);
    
                } else {
                    setUser(null);
                }
            });
        }, [curUser])
    )
    // useEffect(() => {
    //     auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             setUser(user);
    //             _showGroupList(user.uid);

    //         } else {
    //             setUser(null);
    //         }
    //     });
    // }, [curUser])

    const handleRefresh = React.useCallback(() => {
        const uid = auth().currentUser.uid
        setRefreshing(true);
        setTimeout(async() => {
            await _showGroupList(uid);
            setRefreshing(false);
        }, 2000);
    }, []);

    const ListFooter =( // for test
        <View>
            <Pressable 
                style={Styles.btnaddex}
                onPress= {()=>{
                    from = {uid:"1tmvjTfbUSRTCdTMldSpVZXhXLP2",name:"J"}
                    to = {uid: "NZA9HHxQTmaGyANy0071ybo7WDr2",name:"Pop"}
                    gid = "7LYCdIH5J2zHCNh88GAW"
                    ex = []
                    for(let n=0;n<5;n++){
                        ex.push({ename:`test-${n}`,priceToPay:10*n})
                    }
                    
                    // sendDebtClearNoti(to,gid,"My moon")
                    sendPaidDebtNoti(from,to,gid,"My moon",ex)
                    alert("Sent noti")
                    
                }}
            >
                <Text style={Styles.text}>Send Noti</Text>
            </Pressable> 
        </View>
    )

    return(
        <SafeAreaView style={Styles.list_container}>
            {groupList && <SectionList
                style={{height:'100%'}}
                sections={[
                    {title: 'Group', data: groupList},
                ]}
                renderItem={({item}) => 
                    <TouchableOpacity key={'Group'} style ={{flex: 1}} onPress={() => 
                        navigation.navigate('Group',{gid:item.gid})
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
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({section}) => (
                    <Text style={Styles.sectionHeader}>{section.title}</Text>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                // ListFooterComponent={ListFooter}
            />}
        </SafeAreaView>
    );
}