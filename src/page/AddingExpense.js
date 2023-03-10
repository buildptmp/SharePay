import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef, useMemo } from "react";
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
import {addExpense, addDebtor, getMemberListByGid, editExpenseAfterView} from '../../database/DBConnection'
import SwitchSelector from 'react-native-switch-selector';

export default function AddingExpense({ route, navigation }) {
    const { gid, gname, itemInfo, isUpdate} = route.params  
    const [memberList, setMemberList] = useState([]);
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [Creditor, setCreditor] = useState("");
    // const [debtorList, setDebtorList] = useState([]);
    const [isSplitEqually, setMethod] = useState(true);
    const [sectionData, setSectionData] = useState({});
    const [Itemid, setItemID] = useState("");
    let debtorList =[]

    async function seeMember(){
        const mList = await getMemberListByGid(gid);
        setMemberList(mList);
    }
    useEffect(() => {
        seeMember()
        // console.log(itemInfo)
        if (isUpdate){
            console.log("SEE",ItemName,ItemPrice,Creditor.name,debtorList,isSplitEqually)
            setItemName(itemInfo.name);
            setItemPrice(itemInfo.price);
            setItemID(itemInfo.eid);
            setCreditor(itemInfo.creditor);
            setMethod(itemInfo.method == "Split Equally" ? true: false)
            console.log("update ", itemInfo.eid)
        }
    },[Itemid])

    async function _addExpense(){
        // console.log("LOOK ",debtorList)
        if(debtorList.length>=1){
            const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
            const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid, methodName,gid);
            const countSplitEquallyMember = await _countSplitEquallyMember(debtorList);
            await addDebtor(debtorList,itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember);
            
            // console.log("must be behind the update")
            alert("Successfully added.")
            navigation.navigate('ItemInfo',{eid:itemid, allowToEdit:true})
        }
        else{
            alert("Please select the debtor.")
        }
    }
    
    async function _updateExpense(){
        if(debtorList.length>=1){
            const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
            const countSplitEquallyMember = await _countSplitEquallyMember(debtorList);
            editExpenseAfterView(itemInfo.eid, ItemName,ItemPrice,itemInfo.creditor.uid,debtorList,gid);
            addDebtor(debtorList,itemInfo.eid,gid,itemInfo.creditor.uid,itemInfo.price, countSplitEquallyMember)
            alert("Successfully update.") 
            navigation.navigate('ItemInfo',{eid:itemid, allowToEdit:true})
        }
        else{
            alert("Please select the debtor.")
        }
    }

    const SetItemInfo = (
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
            
            <View style={{width:'60%'}}>
               <Text style={Styles.textInputHeader}>Spliting Method</Text>
                <SwitchSelector
                    initial={0}
                    onPress={value => {setMethod(value)
                    console.log(value)}}
                    textColor={'#F88C8C'} //'#7a44cf'
                    selectedColor={'#fff'}
                    buttonColor={'#F88C8C'}
                    borderColor={'#F88C8C'}
                    hasPadding
                    options={[
                        { label: "Split Equally", value: true}, 
                        { label: "Split Unequally", value: false} 
                    ]}
                    testID="gender-switch-selector"
                    accessibilityLabel="gender-switch-selector"
                /> 
            </View>  
        </View>
    )

    const ListHeader =(
        <View style={{marginLeft:10}}>
            {SetItemInfo}
            <View style={{paddingTop:10}}>
                <Text style={Styles.textInputHeader}>Debtor</Text>
                <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
            </View>
        </View>
    )

    function crudOfDebtor(checker,uid, price, percentage){

        const isSplitEqually_debtor = (isSplitEqually ? true : (Number(price) > 0 ? false: true));
   
        let debtorListTemp = debtorList;
        if(checker){
            const index = debtorListTemp.findIndex((obj => obj.uid == uid))
            
            if(index >= 0){
                debtorListTemp[index].priceToPay = Number(price);
                debtorListTemp[index].isSplitEqually = isSplitEqually_debtor
                debtorListTemp[index].percentage = percentage + '%'
            }
            else{
                debtorListTemp.push({uid:uid, isSplitEqually:isSplitEqually_debtor, priceToPay:Number(price),percentage:percentage + '%'})
            }
        }else{
            debtorListTemp = debtorListTemp.filter(debtorList => debtorList.uid != uid)
        }
        debtorList = debtorListTemp
        console.log("selected debtor",debtorList)
        // setDebtorList(debtorListTemp)
    }

    const Checkbox = (props) => {
        const [checker, setChecker] = useState(false);
        const [price, setCheckboxPrice] = useState(0);
        const [percentage, setPercentage] = useState(0)
        const data = props.data;

        let setpercent = price>0 ? Math.round(((price/ItemPrice * 100)+Number.EPSILON)*100)/100 : 0;

        return(
            <View style ={{flex: 1, paddingHorizontal:20}} >
                <TouchableOpacity 
                onPress={()=>{
                    crudOfDebtor(!checker, data.uid,price, percentage)
                    setChecker(!checker)
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
                        editable={!isSplitEqually}
                        keyboardType={'number-pad'}
                        placeholder={"0"}
                        defaultValue={0}
                        onChangeText={(text) => {
                            if(!text){
                                setCheckboxPrice(0)
                            }
                            else{
                                setCheckboxPrice(text)
                            }
                            // setPercentage(setpercent)
                        }}
                        onEndEditing={()=> {
                            crudOfDebtor(checker,data.uid,price,setpercent)}
                        }
                        onPressIn={()=>{setChecker(true)}}
                        />
                    </View>
                    <Text style={{alignSelf:'center'}}>{setpercent}%</Text>
                </View>
            </View>
            </TouchableOpacity>
            </View>
        );
    }

    ListFooter = (props) => {
        return(
            <View>            
            {
                isUpdate ? 
                <TouchableOpacity 
                    style={Styles.btnaddex}
                    onPress= {_updateExpense} 
                >
                    <Text style={Styles.text}> update Expense</Text>
                </TouchableOpacity> 
                :
                <TouchableOpacity 
                    style={Styles.btnaddex}
                    onPress= {_addExpense} 
                >
                    <Text style={Styles.text}> Add Expense</Text>
                </TouchableOpacity>
            }
            </View>
        ) 
    }

    return(
        <View style={[Styles.containeraddex,Styles.shadowProp]}>
            <SafeAreaView style={Styles.list_container}><SectionList
                sections={[
                    {title: 'Select the debtor', data: memberList},
                ]}
                renderItem={
                    useMemo(() =>{
                    return ({item, index}) => 
                    <Checkbox source={{uri:item.image}} name={item.name} data={item}></Checkbox>
                    },[sectionData,isSplitEqually, ItemPrice, debtorList])
                }
                keyExtractor={(item, index) => item + index}
                ListHeaderComponent={ListHeader }
                renderSectionFooter={() => <View style={{height:20, marginHorizontal:20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,backgroundColor:'#F88C8C'}} />}
                renderSectionHeader={() => <View style={{height:20, marginHorizontal:20, borderTopLeftRadius: 20, borderTopRightRadius: 20,backgroundColor:'#F88C8C'}} />}
                ListFooterComponent={<ListFooter />}
                stickySectionHeadersEnabled={true}
            /></SafeAreaView>
        </View>
    );
};

async function _countSplitEquallyMember(debtors){
    let count = 0;
    for(debtor of debtors){ if(debtor.isSplitEqually) count++; }
    return count
}