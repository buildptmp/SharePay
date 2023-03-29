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
import { getAllNoti, setReadNeedReaction, addEditGroupMember, setGroupInvResponse } from '../../database/DBConnection';

 export default function Notification({ navigation, route }) {
    const {uid} = route.params;
    const [notiList, setNoti] = useState("");
    const [ready, setReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    async function showNoti(){
        await getAllNoti(uid).then(nList =>{
            setNoti(nList);
            // console.log(nList);
        })
        setReady(true);
    }
    useEffect(()=>{
        showNoti();
    },[])

    const handleRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(async() => {
            await showNoti();
            setRefreshing(false);
        }, 2000);
    }, []);
    
    RenderItem = (props) => {
        const hasread = props.read;
        const needreaction = props.reaction;
        const record = props.item.notification;
        const time = props.item.dateFormat;
        const GroupInvResponse = props.item.action;
        const [invstatus, setinvStatus] = useState("");

        async function groupinvResponse(isaccept, touid, groupgid){
            const action = isaccept? 'accepted': 'declined'
            await setReadNeedReaction( props.item.nid ,true, false);
            await addEditGroupMember(groupgid,touid,action);
            await setGroupInvResponse(props.item.nid,action)
            setinvStatus(action);
        }

        useEffect(()=>{
            if(!hasread)  setReadNeedReaction(props.item.nid,true);
            if (record.type == 'groupinv' && !needreaction && hasread && GroupInvResponse){
                setinvStatus(GroupInvResponse);
            }
        },[invstatus])

        const TapToPadding = (props) =>{
            const [openPad, setOpenPad] = useState(false);
            return (
                <Pressable onPress={()=>setOpenPad(!openPad)}>
                    <Text style={{fontSize:16, color:'grey'}}>{props.message}</Text>
                    {
                        openPad ?
                        <>
                            <Text style={{fontSize:16, color:'grey'}}>{props.padding}</Text>
                            <Text style={{fontSize:16, color:'grey'}}>{props.endding}</Text>
                        </>
                        :
                        <>
                            <Text style={{fontSize:16, color:'grey'}}>{props.endding}</Text>
                            <Text style={{fontWeight:'bold'}}>Click for more information</Text>
                        </>
                    }
                </Pressable>
            )
        }
        return (
            <View style={{flex:1}}>
                <View style={{
                padding:10,
                backgroundColor: (hasread? (needreaction ? '#FFFFFF':'#C7C6C1'):'#FFFFFF'),
                borderBottomWidth: 1,
                borderColor: '#48494B',
                }}>
                <View style={{flexDirection:'row', marginBottom:5}}>
                    <View style={{width: '67%',flexDirection:'row'}}>
                        <Text style={{fontWeight:'bold', fontSize:20, marginRight:6}}>{record.header}</Text>
                        {invstatus ? <Text style={{fontSize:16, color:'#F88C8C', fontWeight:'bold'}}>( {invstatus} )</Text>:null}
                        {hasread || invstatus? null:<Text style={{fontSize:16, color:'#F88C8C', fontWeight:'bold'}}>( new )</Text>}
                    </View>
                    
                    <View style={{width: '35%',justifyContent:'center'}}>
                        <Text style={{fontSize:12}}>{time}</Text>
                    </View>
                </View>

                <View>
                    {
                        record.type == "payment-paid" ?
                        <TapToPadding message={record.message} padding={record.padding} endding={record.endding}/>
                        : 
                        <Text style={{fontSize:16, color:'grey'}}>{record.message}</Text>
                    }
                </View>
                {
                    record.type == 'groupinv' && needreaction? 
                    <View style={{padding:5, paddingTop:10, flexDirection:'row', justifyContent:'space-around'}}>
                        <Pressable 
                            style={Styles.btnpopup}
                            onPress= {()=> groupinvResponse(true,props.item.touid,record.group.gid)} 
                        >
                            <Text style={Styles.text}>accept</Text>
                        </Pressable>
                        <Pressable 
                            style={Styles.btnpopup}
                            onPress= {()=> groupinvResponse(false,props.item.touid,record.group.gid)}
                        >
                            <Text style={Styles.text}>decline</Text>
                        </Pressable>
                    </View>
                    :
                    null
                }
            </View>
            </View>
            
        )
    }

    // const headerList = (
    //     <View>

    //     </View>
    // );

    return(
        <SafeAreaView style={Styles.list_container}>
            {/* {console.log("notiList ???",notiList)} */}
            { notiList &&
            <FlatList
                // section={[
                //     {title: "notiification", data: notiList}
                // ]}
                data={notiList}

                style={{height:'100%'}}
                keyExtractor={(item, index)=> {
                    return index+item;
                }}
                renderItem={({item,index})=>(
                    // {console.log("item",item.needreaction)}
                    <RenderItem item={item} read={item.read} reaction={item.needreaction}/>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                // ListEmptyComponent={<View><Text>No notification.</Text></View>}
            />
            } 
        </SafeAreaView>
       
    );
};