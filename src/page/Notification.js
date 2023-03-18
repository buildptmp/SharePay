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
    Pressable,
    RefreshControl
} from "react-native";
import { getAllNoti, setReadNeedReaction, addEditGroupMember } from '../../database/DBConnection';

 export default function Notification({ navigation, route }) {
    const {uid} = route.params;
    const [notiList, setNoti] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    async function showNoti(){
        await getAllNoti(uid).then(nList =>{
            setNoti(nList);
        })
    }
    useEffect(()=>{
        showNoti();
    },[])

    const handleRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(async() => {
            await getAllNoti();
            setRefreshing(false);
        }, 2000);
    }, []);

    // const data = [
    //     {
    //         ID: '01',
    //         Username: 'Bilkin',
    //         NotiType: ' still have debt in "xxxx" Group',
    //         Time: '12.00',
    //     },
    //     {
    //         ID: '02',
    //         Username: 'Jino',
    //         NotiType: 'has invited you to join "XXXX" Group',
    //         Time: '16.40',
    //     },
    //     {
    //         ID: '03',
    //         Username: 'Capybara',
    //         NotiType: ' has paid the debt to you',
    //         Time: '12.00',
    //     },
    //     {
    //         ID: '04',
    //         Username: 'PP',
    //         NotiType: 'All expense in "XXXX" group are paid',
    //         Time: '12.00',
    //     },
    //     {
    //         ID: '05',
    //         Username: 'Kim',
    //         NotiType: 'Still have the debt',
    //         Time: '12.00',
    //     },
    // ]
    
    const RenderItem = (props) => {
        const hasread = props.read;
        const needreaction = props.reaction;
        const record = props.item.notification;
        const time = props.item.timestamp;
        const [resp, setResp] = useState("");

        async function groupinvResponse(isaccept, read, needreaction, touid, groupgid){
            await setReadNeedReaction(read, needreaction)
            await addEditGroupMember(touid,groupgid,(isaccept? 'accepted': 'declined'));
            setResp((isaccept? 'accepted': 'declined'));
        }

        useEffect(()=>{
            setReadNeedReaction(props.item.nid,true);
        },[])

        return (
            <View style={{
                // width: '100%',
                // height: 50,
                padding:10,
                backgroundColor: (hasread||!needreaction ? '#B9BBB6':'#FFFFFF'),
                borderBottomWidth: 1,
                borderColor: '#48494B',
                // flexDirection: 'row',
                }}>
                <View style={{flexDirection:'row'}}>
                    <View style={{width: '70%',flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold', fontSize:20}}>{record.header}</Text>
                        {hasread? null:<Text style={{fontSize:16, color:'#F88C8C'}}>( new )</Text>}
                        {(record.type == 'groupinv' && !needreaction && hasread) || resp? <Text style={{fontSize:16, color:'#F88C8C'}}>( {resp? resp:props.UserGroup.status} )</Text>:null}
                    </View>
                    
                    <View style={{width: '30%',justifyContent:'center'}}>
                        <Text style={{fontSize:14}}>{time}</Text>
                    </View>
                </View>

                <View>
                    <Text style={{fontSize:16, color:'grey'}}>{record.message}</Text>
                </View>
                {
                    record.type == 'groupinv' && needreaction? 
                    <View style={{padding:20, flexDirection:'row'}}>
                        <Pressable 
                            style={Styles.btnpopup}
                            onPress= {()=> groupinvResponse(true,true,false,props.to.uid,record.group.gid)} 
                        >
                            <Text style={Styles.text}>accept</Text>
                        </Pressable>
                        <Pressable 
                            style={Styles.btnpopup}
                            onPress= {()=> {
                                groupinvResponse(false,true,false,props.to.uid,record.group.gid);
                                setResp(true);
                            }}
                        >
                            <Text style={Styles.text}>decline</Text>
                        </Pressable>
                    </View>
                    :
                    null
                }
            </View>
        )
    }

    // const headerList = (
    //     <View>

    //     </View>
    // );

    return(
        <View style={Styles.list_container}>
            <FlatList
                data={notiList}
                keyExtractor={(item, index)=> {
                    return index.toString();
                }}
                renderItem={({item})=>{
                    <RenderItem item={item} read={item.read} reaction={item.needreaction}></RenderItem>
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            ></FlatList>
        </View>
       
    );
};