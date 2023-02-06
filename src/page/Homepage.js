import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Styles } from "../Styles"
import { getGroupListByUid } from "../../database/DBConnection";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 5,
      backgroundColor: '#F6EFEF',
    },
    sectionHeader: {
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      fontSize: 20,
      fontWeight: 'bold',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

export default function Homepage({page, navigation}){
    console.log("This is HomePage")
    const [curUser, setUser] = useState(null);
    const [isReady, setReady] = useState(false);
    const [groupList, setGroupList] = useState([{}]);
    const RouteMapping = [
        { routeName: 'GroupInfo', displayText: 'Group Info'},
    ]

    async function _showGroupList(){
        let gList = await getGroupListByUid(auth().currentUser.uid);
        setGroupList(gList)
        // console.log(groupList)
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
        // console.log(curUser)
    }, [])

    function _signOut() {
        auth()
        .signOut()
        .then(() => navigation.navigate('UserSelect'))
    }

    return(
        <View style={{flex:1}}>
            {groupList && <SafeAreaView style={styles.container}>
            <SectionList
                sections={[
                {title: 'Group', data: groupList},
                ]}
                renderItem={({item}) => 
                <TouchableOpacity key={'GroupInfo'} style ={{flex: 3}} onPress={() => 
                    // console.log(item.gid)
                    navigation.navigate('GroupInfo',{gid:item.gid, gname:item.name})
                }>
                    <View style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderColor: '#7E828A',
                        }}>
                        <Text style={styles.item}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
                }
                renderSectionHeader={({section}) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
            /></SafeAreaView>}
        </View>
    );
}