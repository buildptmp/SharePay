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
        // console.log("item info ",item.eid)
    }

    useEffect(()=>{
        showItemInfo();
    },[])

    ListHeader = (props) => {
        return(
            <View style={{justifyContent:'space-between', backgroundColor:'#F88C8C'}}>
                <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={[Styles.sectionHeaderwithsub,{color:'white'}]}>Name {itemInfo.name} </Text> 
                        <Text style={[Styles.sectionHeaderwithsub,{color:'white'}]}>Group {gname} </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={[Styles.sectionHeaderwithsub,{color:'white'}]}>Price {itemInfo.price} </Text>
                        <Text style={[Styles.sectionHeaderwithsub,{color:'white'}]}>Method {itemInfo.method} </Text>
                    </View>
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

    RenderItem = ({item, title}) => {
        return (
            <TouchableOpacity style ={{flex: 1}} onPress={() => {}}>
                <View style={Styles.Iteminfo}>
                    <View style={{width: '50%',flexDirection: 'row',}}>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/>  
                        <Text style={Styles.item}>{item.name}</Text> 
                    </View>
                    <View style={{width: '20%'}}>
                        {title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'center'}]}>{item.debtstatus}</Text>:null}
                    </View>
                    <View style={{width: '30%'}}>
                        {title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{item.calculatedprice}</Text>:null}
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
                    onPress={()=>{
                        if(allowToEdit){
                            navigation.goBack();
                        } 
                        navigation.goBack();
                    }}
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
                renderItem={({item, title}) => (
                    <RenderItem item={item} title={title}/>
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

