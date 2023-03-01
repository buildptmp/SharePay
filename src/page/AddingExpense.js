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
//  import CheckBox from 'react-native-check-box';
import SectionList from 'react-native/Libraries/Lists/SectionList';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Fontisto';
// import Icon from 'react-native-vector-icons/AntDesign';
import {addExpense, addDebtor, getMemberListByGid} from '../../database/DBConnection'
// import Selection from '../components/option';

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
        const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid,gid);
        const countSplitEquallyMember = await _countSplitEquallyMember(debtorListTemp);
        const debtorids = await addDebtor(debtorListTemp,itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember)
        setDebtorList({itemid:itemid,debtorids:debtorids})
        alert("Successfully added.")
    }
    
    Checkbox = (props) => {
        const [checker, setChecker] = useState(false)
        const data = props.data
        return(
            <TouchableOpacity style ={{flex: 1}} defaultValue={{uid:data.uid}} 
                onPress={()=>{
                    let debtor;
                    if(!checker){
                        debtorListTemp.push({uid:data.uid, isSplitEqully:true, percentage:0})
                        debtor = debtorListTemp
                    }else{
                        debtor = debtorListTemp.filter(debtorList => debtorList.uid != data.uid)
                    }
                    console.log(debtor)
                    setChecker(!checker)
                    debtorListTemp = debtor
            }}>
            <View style={{
                width: '100%',
                height: 50,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderColor: '#7E828A',
                flexDirection: 'row'
                }}>
                    <Icon name={(checker ? 'checkbox-active':'checkbox-passive')} size={35} style={{margin:6.5, width:40}}></Icon>
                    <Image style={{borderRadius: 50, height:35, width:35,margin:6.5 }} source={props.source}/>
                    <Text style={Styles.item}>{props.name}</Text>
            </View>
            </TouchableOpacity>
        );
    }

    Checkbox = (props) => {
        const [checker, setChecker] = useState(false)
        const data = props.data
        return(
            <TouchableOpacity style ={{flex: 1}} defaultValue={{uid:data.uid}} onPress={()=>setChecker(!checker)}>
            <View style={{
                width: '100%',
                height: 50,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderColor: '#7E828A',
                flexDirection: 'row'
                }}>
                    <Icon name={(checker ? 'checkbox-active':'checkbox-passive')} size={35} style={{margin:6.5, width:40}}></Icon>
                    <Image style={{borderRadius: 50, height:35, width:35,margin:6.5 }} source={props.source}/>
                    <Text style={Styles.item}>{props.name}</Text>
            </View>
            </TouchableOpacity>
        );
    }
    // const Member = ["Buildkin", "Prai", "Pop"]
    return(
        <ScrollView>
        <View style={Styles.containeraddex}>
            <View style={{ width: '100%', paddingHorizontal: 10}}>
                <Text style={Styles.textboxtop}>Item Name</Text>
                <TextInput
                    style={Styles.inputaddex}
                    value={ItemName}
                    placeholder={"Insert item"}
                    onChangeText={(text) => setItemName(text)}
                    autoCapitalize={"none"}
                />
            </View>
            <View style={{ width: '100%', paddingHorizontal: 10}}>
                <Text style={Styles.textboxtop}>Price</Text>
                <TextInput
                    style={Styles.inputaddex}
                    value={ItemPrice}
                    keyboardType={'number-pad'}
                    placeholder={"Insert Price"}
                    onChangeText={(text) => setItemPrice(text)}
                    autoCapitalize={"none"}
                />
            </View>
            <Text style={Styles.textboxtop}>Creditor</Text>
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
            
            <View style={{alignSelf:'flex-start', paddingTop:10}}>
                <Text style={Styles.sectionHeaderwithsub}>Debtor</Text>
                <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
            </View>

            <SafeAreaView style={Styles.list_container2}><SectionList
                sections={[
                    {title: 'Select the debtor', data: memberList},
                ]}
                renderItem={({item, index}) => 
                <Checkbox source={{uri:item.image}} name={item.name} data={item}></Checkbox>
                }
                keyExtractor={(item, index) => item + index}
            /></SafeAreaView>
            <TouchableOpacity 
                style={Styles.btnaddex}
                onPress= {_addExpense} 
            >
                <Text style={Styles.text}> Add Expense</Text>
            </TouchableOpacity>
        </View> 
        </ScrollView>
    );
};

