// import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import Homepage from './Homepage';
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
import { getExpenseInfo, editExpneseName } from "../../database/DBConnection";
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { async } from '@firebase/util';

export default function ItemInfo({ route,navigation }) {
    const {eid,gid,price } = route.params;
    const [itemInfo, setItemInfo] = useState({});
    const [isReadyE, setReadyE] = useState(false);

    let newName = "";

    const [editableName,setEditableName] = useState(false);
    const itemNameRef = useRef(null);
    const RouteMapping = [
        { routeName: 'Homepage', displayText: 'Homepage', }
    ]

    async function showItemInfo(){
        const item = await getExpenseInfo(gid,eid);
        // console.log("EIEI");
        // console.log([item.creditor]);
        // console.log("EIEI2");
        // console.log(item.debtor);
        // console.log(item.name)
        setItemInfo(item);
        setReadyE(true);
    }

    function _saveEditItem(){
        console.log("newName is "+ newName)
        editExpneseName(eid,newName);
        alert("Edit successfully. Please refresh to see the change.")
    }

    useEffect(()=>{
        setEditableName(false);
        setReadyE(false);
        showItemInfo();
    },[])

    editItemName = () => {
        // itemNameRef.current.editable = true
        setEditableName(true)

        itemNameRef.current.focus(); 
    }

    ListHeader = (props) => {
        return(
            <View style={{}}>
                <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={Styles.sectionHeaderwithsub}>Name </Text>
                        <TextInput ref ={itemNameRef} editable={editableName} style={[Styles.sectionHeaderwithsub,]}
                            onChangeText={text => {newName = text}}>{itemInfo.name}</TextInput>
                        {!editableName?<AntDesign 
                            name='edit'
                            size={18}
                            style={{marginTop:5, marginLeft:5}}
                            onPress={editItemName}
                        />: null}
                        {editableName? <AntDesign name="close" color="black" size={20} style={{marginTop:5, marginLeft:5}} onPress={() => {
                            setEditableName(false)
                            text = ""
                        }} />:null}
                    </View>
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
                <View style={Styles.Iteminfo
                    // width: '100%',
                    // height: 50,
                    // paddingVertical:3,
                    // backgroundColor: '#FFFFFF',
                    // borderBottomWidth: 1,
                    // borderColor: '#7E828A',
                    // flexDirection: 'row',
                    }>
                    <View style={{width: '50%',flexDirection: 'row',}}>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>  
                        <Text style={Styles.item}>{props.item.name}</Text> 
                    </View>
                    <View style={{width: '30%',flexDirection: 'row',/*justifyContent:'center'*/}}>
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:3}]}>{props.item.debtstatus}</Text>:null}
                        {/* {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.calculatedprice}</Text>:null} */}
                    </View>
                    <View style={{width: '20%',flexDirection: 'row',/*justifyContent:'left'*/}}>
                        {/* {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end'}]}>{props.item.debtstatus}</Text>:null} */}
                        {props.title != 'Creditor' ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:0}]}>{props.item.calculatedprice}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    ListFooter = (props) => {
        return(
            <View style={{marginTop:20}}>
                {editableName ? 
                <TouchableOpacity 
                    style={Styles.btnitif}
                    onPress={_saveEditItem}
                    >
                    <Text style={Styles.text}> Save Edit </Text>
                </TouchableOpacity>
                :null}
                <TouchableOpacity 
                    style={Styles.btnitif}
                    onPress={()=>{}}
                    >
                    <Text style={Styles.text}> Done </Text>
                </TouchableOpacity>
            </View>
            
        ) 
    }

    return(
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
                ListHeaderComponent={() => <ListHeader />}
                renderSectionHeader={({section: {title}}) => <SectionHeader title={title} />}
                ListFooterComponent={ () => <ListFooter />}
                />
            }
        </SafeAreaView>
    );
};

