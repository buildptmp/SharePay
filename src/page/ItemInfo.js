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
    const RouteMapping = [
        { routeName: 'Homepage', displayText: 'Homepage', }
    ]

    async function showItemInfo(){
        const item = await getExpenseInfo(gid,eid);
        console.log("EIEI");
        console.log(item);
        setItemInfo(item);
    }
    useEffect(()=>{
        showItemInfo()
    },[])

    RenderItem = (props) => {
        return (
            <TouchableOpacity style ={{flex: 1}} onPress={() => 
                //console.log(props.item.name)
                navigation.navigate('ItemInfo',{eid:props.item.eid, ename:props.item.name, gid:gid, price: props.item.price})
                //navigation.navigate('ItemInfo')
            }>
                <View>
                    <text>{item}</text>
                </View>
                <View style={{
                    // width: '100%',
                    // height: 50,
                    paddingVertical:3,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderColor: '#7E828A',
                    flexDirection: 'row',
                    }}>
                    <View style={{width: '80%',flexDirection: 'row',}}>
                        {props.title == "Expense item" ? <Text style={Styles.item}>{props.index + 1}</Text>:<Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>}    
                        <View style={{}}>
                            <Text style={Styles.item}>{props.item.name}</Text> 
                            {props.title == "Expense item" ? <Text style={Styles.itemDesc}>Creditor name {props.item.creditor.name}</Text> : null }
                        </View>
                    </View>
                    <View style={{width: '20%',justifyContent:'center'}}>
                        {props.title == "Expense item" ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.price}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
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
            <SectionList
         
            sections={[
                {title: 'Creditor', data: [itemInfo.creditor]},
                {title: 'Debtor', data: itemInfo.debtor},

            ]}
            renderItem={({item}) => (
                <View style={{}}>
                  <Text style={{}}>{item.name}</Text>
                </View>
              )}
            keyExtractor={(item, index) => item + index}
            // ListEmptyComponent={()=>{
            //     <Text>There is no member in this group.</Text>
            // }}
            // renderSectionHeader={({section: {title}}) => <ListHeader title={title} />}
            // ListFooterComponent={ () => <RenderFooter />}
            // ListFooterComponentStyle={{paddingTop:20}}
            />
        </SafeAreaView>
    );
};

