import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import Homepage from './Homepage';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState } from "react";
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
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { getGroupByGid, getMemberListByGid, getExpenseListByGid } from '../../database/DBConnection'
import { uploadGroupImg, imagePicker } from '../../database/Storage'
import { editGroup, checkAllowToleave, addEditGroupMember, deleteGroup } from '../../database/DBConnection';
import { async } from '@firebase/util';

export default function ItemInfo({ route,navigation }) {
    const {eid,ename,gid,price } = route.params;
    const [itemInfo, setItemInfo] = useState({});
    const [isReadyE, setReadyE] = useState(false)
    const RouteMapping = [
        { routeName: 'Homepage', displayText: 'Homepage', }
    ]

    async function showItemInfo(){
        const item = await getExpenseInfo(gid,eid);
        console.log("EIEI");
        console.log([item.creditor]);
        console.log("EIEI2");
        console.log(item.debtor);
        setItemInfo(item);
        setReadyE(true);
    }
    useEffect(()=>{
        setReadyE(false);
        showItemInfo()
    },[])

    ListHeader = (props) => {
        return(
            <View style={{}}>
                <View style={{paddingTop:10}}>
                    <Text style={Styles.sectionHeaderwithsub}>Name {ename}</Text>
                    <Text style={Styles.sectionHeaderwithsub}>Price {price}</Text>
                    <Text style={Styles.sectionHeaderwithsub}>Method</Text>
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
            <TouchableOpacity style ={{flex: 1}} onPress={() => {}
                // navigation.navigate('ItemInfo',{eid:props.item.eid, ename:props.item.name, gid:gid, price: props.item.price})
            }>
                <View style={{
                    // width: '100%',
                    // height: 50,
                    paddingVertical:3,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderColor: '#7E828A',
                    flexDirection: 'row',
                    }}>
                    <View style={{width: '60%',flexDirection: 'row',}}>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>  
                        <Text style={Styles.item}>{props.item.name}</Text> 
                    </View>
                    <View style={{width: '25%',flexDirection: 'row',justifyContent:'center'}}>
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end'}]}>{props.item.debtstatus}</Text>:null}
                        {/* {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.calculatedprice}</Text>:null} */}
                    </View>
                    <View style={{width: '15%',flexDirection: 'row',justifyContent:'center'}}>
                        {/* {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end'}]}>{props.item.debtstatus}</Text>:null} */}
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.calculatedprice}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    ListFooter = (props) => {
        return(
            <TouchableOpacity 
                style={Styles.btnaddex}
                >
                <Text style={Styles.text}> Done </Text>
            </TouchableOpacity>
        ) 
    }

    return(
        

        // <View style={Styles.container}>
        //     {/* <View style={[{flex:1}]} /> */}
        //     <View style={[{ marginHorizontal: 20, backgroundColor: '#F6EFEF'}]}>
        //         <Text style={{fontSize:12}}>Item Name: {ename} </Text>
        //         <Text style={{fontSize:12}}>Item Price: {price} </Text>
        //         <Text style={{fontSize:12}}>Creditor: {JSON.stringify(itemInfo.creditor)} </Text>
        //         <Text style={{fontSize:12}}> Debtor: {JSON.stringify(itemInfo.debtor)} </Text>
        //         <TouchableOpacity 
        //             // key={e.routeName}
        //             style={Styles.btnslip}
        //            // onPress={() => navigation.navigate('GroupInfo')}
        //         >
        //             <Text style={Styles.text}> Done </Text>
        //         </TouchableOpacity>
        //     </View>
        // </View> 

        <SafeAreaView>
            {
                isReadyE && <SectionList
                sections={[
                    {title: 'Creditor', data: [itemInfo.creditor]},
                    {title: 'Debtor', data: itemInfo.debtor},
                ]}
                renderItem={({item}) => (
                    <RenderItem item={item}/>
                )}
                keyExtractor={(item, index) => item + index}
                // ListEmptyComponent={()=>{
                //     <Text>There is no member in this group.</Text>
                // }}
                ListHeaderComponent={() => <ListHeader />}
                renderSectionHeader={({section: {title}}) => <SectionHeader title={title} />}
                ListFooterComponent={ () => <ListFooter />}
                // ListFooterComponentStyle={{paddingTop:20}}
                />
            }
            
        </SafeAreaView>
    );
};

