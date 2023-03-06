import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef } from "react";
import { Button, 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
    ScrollView
 } from "react-native";
import SectionList from 'react-native/Libraries/Lists/SectionList';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Fontisto';
import {addExpense, addDebtor, getMemberListByGid} from '../../database/DBConnection'
import SwitchSelector from 'react-native-switch-selector';

export default function AddingExpense({ route, navigation }) {
    const { gid, gname } = route.params
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [Creditor, setCreditor] = useState("");
    const [memberList, setMemberList] = useState([]);
    const [debtorList, setDebtorList] = useState([]);
    let debtorListTemp = [];

    async function seeMember(){
        const mList = await getMemberListByGid(gid);
        setMemberList(mList)
    }
    useEffect(() => {
        seeMember()
    },[])
    
    // const debtorList = [{uid:"1tmvjTfbUSRTCdTMldSpVZXhXLP2",isSplitEqully:false,percentage:50},
    // {uid:"KAFwUHfoEBe1VQwXCcX1wxgYAfF2",isSplitEqully:true,percentage:0},
    // {uid:"NZA9HHxQTmaGyANy0071ybo7WDr2",isSplitEqully:true,percentage:0},
    // {uid:"dzbzw8RQeXX2jsnd0HHZ2P6txC22",isSplitEqully:true,percentage:0}
    // ]
    function handleChange(item) {
        console.log(item)
      };

    async function _countSplitEquallyMember(debtors){
        let count = 0;
        for(debtor of debtors){ if(debtor.isSplitEqully) count++; }
        return count
    }

    async function _addExpense(){
        if(debtorListTemp.length>=1){
            const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid,gid);
            const countSplitEquallyMember = await _countSplitEquallyMember(debtorListTemp);
            const debtorids = await addDebtor(debtorListTemp,itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember)
            setDebtorList({itemid:itemid,debtorids:debtorids})
            alert("Successfully added.")
        }
        else{
            alert("Please select the debtor.")
        }
    }
    
    SetItemInfo = (props) => {
        return(
            <View>
                <Text style={Styles.textInputHeader}>Item Name</Text>
                <View style={Styles.itemInput}>
                    <TextInput
                    value={ItemName}
                    placeholder={"Insert item"}
                    onChangeText={(text) => setItemName(text)}
                    autoCapitalize={"none"}
                    />
                </View>
                

                <Text style={Styles.textInputHeader}>Price (Baht)</Text>
                <View style={Styles.itemInput}>
                    <TextInput
                    value={ItemPrice}
                    keyboardType={'number-pad'}
                    placeholder={"Insert Price"}
                    onChangeText={(text) => setItemPrice(text)}
                    />
                </View>
                

                <Text style={Styles.textInputHeader}>Creditor</Text>
                <SelectDropdown
                    data={memberList}
                    defaultButtonText={'Select a Creditor'}
                    onSelect={(selectedItem) => {
                        setCreditor(selectedItem)
                    }} 
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem.name
                    }}
                    rowTextForSelection={(member) => {
                        return member.name
                    }} 
                    search={true}
                    searchPlaceHolder={"Search for a name"}
                    renderSearchInputLeftIcon={()=>{
                        return(<Icon name="search"/>);
                    }}
                    buttonStyle={Styles.dropdownBtnStyle}
                    buttonTextStyle={Styles.dropdownBtnTxtStyle}
                    renderDropdownIcon={(selectedItem) => {
                        return (<Icon name={selectedItem ? 'angle-up':'angle-down'}/>);
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={Styles.dropdownDropdownStyle}
                    rowStyle={Styles.dropdownRowStyle}
                    rowTextStyle={Styles.dropdownRowTxtStyle}
                />
                <Text style={Styles.textInputHeader}>Spliting Method</Text>

            </View>
        )
    }

    ListHeader = (props) => {
        return(
            <View style={{marginLeft:10}}>
                <SetItemInfo />
                <View style={{paddingTop:10}}>
                    <Text style={Styles.textInputHeader}>Debtor</Text>
                    <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
                </View>
            </View>
        );
    }

    Checkbox = (props) => {
        const [checker, setChecker] = useState(false);
        const [price, setCheckboxPrice] = useState(0);
        const data = props.data;
        return(
            <View style ={{flex: 1, paddingHorizontal:20}} >
                <TouchableOpacity 
                onPress={()=>{
                    let debtor;
                    if(!checker){
                        debtorListTemp.push({uid:data.uid, isSplitEqully:true, percentage:0})
                        debtor = debtorListTemp
                    }else{
                        debtor = debtorListTemp.filter(debtorList => debtorList.uid != data.uid)
                    }
                    console.log("selected debtor",debtor)
                    setChecker(!checker)
                    debtorListTemp = debtor
                }}>
            <View style={{
                // width: '100%',
                height: 50,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: '#7E828A',
                flexDirection: 'row',
                justifyContent:'space-between',
                alignContent:'center'
                }}>
                <View style={{flexDirection: 'row', marginLeft:5}}>
                    <Icon name={(checker ? 'checkbox-active':'checkbox-passive')} size={35} style={{margin:6.5, width:40}}></Icon>
                    <Image style={{borderRadius: 50, height:35, width:35,margin:6.5 }} source={props.source}/>
                    <Text style={Styles.item}>{props.name}</Text>
                </View>
                <View style={[Styles.itemInputCheckboxPrice, {marginRight:20,alignSelf:'center', flexDirection:'row',justifyContent:'space-around'}]}>
                    <View style={{width:70}}>
                        <TextInput
                        value={price} 
                        keyboardType={'number-pad'}
                        placeholder={"..."}
                        onChangeText={(text) => setCheckboxPrice(text)}
                        />
                    </View>
                    <Text style={{alignSelf:'center'}}>0%</Text>

                </View>
            </View>
            </TouchableOpacity>
            </View>
            
        );
    }

    ListFooter = (props) => {
        return(
        <TouchableOpacity 
            style={Styles.btnaddex}
            onPress= {_addExpense} 
        >
            <Text style={Styles.text}> Add Expense</Text>
        </TouchableOpacity>
        ) 
    }

    return(
        <View style={[Styles.containeraddex,Styles.shadowProp]}>
            <SafeAreaView style={Styles.list_container}><SectionList
                sections={[
                    {title: 'Select the debtor', data: memberList},
                ]}
                renderItem={({item, index}) => 
                    <Checkbox source={{uri:item.image}} name={item.name} data={item}></Checkbox>
                }
                keyExtractor={(item, index) => item + index}
                ListHeaderComponent={() => <ListHeader />}
                renderSectionFooter={() => <View style={{height:20, marginHorizontal:20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,backgroundColor:'#F88C8C'}} />}
                renderSectionHeader={() => <View style={{height:20, marginHorizontal:20, borderTopLeftRadius: 20, borderTopRightRadius: 20,backgroundColor:'#F88C8C'}} />}
                ListFooterComponent={() => <ListFooter />}
            /></SafeAreaView>
        </View> 
    );
};

