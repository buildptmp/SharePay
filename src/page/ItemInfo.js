import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef, useCallback } from "react";
import { Button, 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
    SectionList,
 } from "react-native";
import { getExpenseInfo } from "../../database/DBConnection";
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { async } from '@firebase/util';

export default function ItemInfo({ route,navigation }) {
    const {gid, gname, eid, allowToEdit } = route.params;
    const [itemInfo, setItemInfo] = useState("");

    async function showItemInfo(){
        const item = await getExpenseInfo(eid);
        setItemInfo(item);
        console.log("item info ",item.eid)
    }

    useEffect(()=>{
        showItemInfo();
    },[])

    ListHeader = (props) => {
        return(
            <View style={{}}>
                <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={Styles.sectionHeaderwithsub}>Name {itemInfo.name} </Text> 
                        <Text style={Styles.sectionHeaderwithsub}>Group {gname} </Text>
                    </View>
                    <Text style={Styles.sectionHeaderwithsub}>Price {itemInfo.price} </Text>
                    <Text style={Styles.sectionHeaderwithsub}>Method {itemInfo.method} </Text>
                </View>
            </View>
        )
    };
    
    SectionHeader = (props) => {
        return(
        <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between', alignContent:'center'}}>
            <Text style={Styles.sectionHeader}>{props.title}</Text>
        </View>)
    };

    RenderItem = (props) => {
        return (
            <TouchableOpacity style ={{flex: 1}} onPress={() => {}}>
                <View style={Styles.Iteminfo}>
                    <View style={{width: '50%',flexDirection: 'row',}}>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>  
                        <Text style={Styles.item}>{props.item.name}</Text> 
                    </View>
                    <View style={{width: '20%'}}>
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'center'}]}>{props.item.debtstatus}</Text>:null}
                    </View>
                    <View style={{width: '30%'}}>
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.calculatedprice}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    ListFooter = (props) => {
        return(
            <View style={{marginTop:20}}>
                {
                    allowToEdit && 
                    <TouchableOpacity 
                        style={Styles.btnitif}
                        onPress={()=>{navigation.navigate('Create Expense', {itemInfo:itemInfo, isUpdate:true, gid:gid, gname:gname})}}
                        // onPress={()=>{alert("Implementing")}}
                        >
                        <Text style={Styles.text}> Edit item </Text>
                    </TouchableOpacity>
                }
                
                <TouchableOpacity 
                    style={Styles.btnitif}
                    onPress={()=>{navigation.navigate(-2)}}
                    >
                    <Text style={Styles.text}> Done </Text>
                </TouchableOpacity>
            </View>
        ) 
    }

    return(
        <SafeAreaView>
            {
                itemInfo && <SectionList
                sections={[
                    {title: 'Creditor', data: [itemInfo.creditor]},
                    {title: 'Debtor', data: itemInfo.debtor},
                ]}
                renderItem={({item}) => (
                    <RenderItem item={item}/>
                )}
                keyExtractor={(item, index) => item + index}
                ListHeaderComponent={({item}) => <ListHeader item={item}/>}
                renderSectionHeader={({section: {title}}) => <SectionHeader title={title} />}
                ListFooterComponent={ () => <ListFooter />}
                />
            }
        </SafeAreaView>
    );
};

