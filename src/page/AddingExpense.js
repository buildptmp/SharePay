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
    const [ItemPrice, setItemPrice] = useState("");
    const [Creditor, setCreditor] = useState("");
    const [isSplitEqually, setMethod] = useState(true);
    const [Itemid, setItemID] = useState("");
    const [Debtor, setDebtor] = useState([]);
    const [total, setTotal] = useState({
        price: 0,
        percent: 0
    });

    const [Data, setData] = useState('');
    const dropdown = useRef(null);
    async function seeMember(){
        const mList = await getMemberListByGid(gid);
        setMemberList(mList);
    }
    useEffect(() => {
        seeMember()
        // console.log(itemInfo)
        if (isUpdate){
            console.log("Before",ItemName,ItemPrice,Creditor.name,isSplitEqually, Itemid, Debtor)
            console.log("After",itemInfo)
            setItemName(itemInfo.name);
            setItemPrice(itemInfo.price);
            setItemID(itemInfo.eid);
            setCreditor(itemInfo.creditor);
            const index = memberList.findIndex((obj => obj.uid == itemInfo.creditor.uid))
            dropdown.current.selectIndex(index)
            setMethod(itemInfo.method == "Split Equally" ? true: false)
            console.log("update ", itemInfo.eid)
        }
    },[itemInfo])

    async function _addExpense(){
        if(Debtor.length>=1){
            const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
            const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid, methodName,gid);
            const countSplitEquallyMember = await _countSplitEquallyMember(Debtor);
            await addDebtor(Debtor,itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember);
            
            // console.log("must be behind the update")
            alert("Successfully added.")
            navigation.navigate('Item Information',{eid:itemid, allowToEdit:true, gid:gid})
        }
        else{
            alert("Please select the debtor.")
        }
    }
    
    async function _updateExpense(){
        if(Debtor.length>=1){
            const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
            const countSplitEquallyMember = await _countSplitEquallyMember(Debtor);
            await editExpenseAfterView(Itemid, ItemName,ItemPrice,itemInfo.creditor.uid,Debtor,gid);
            await addDebtor(Debtor,Itemid,gid,itemInfo.creditor.uid,itemInfo.price, countSplitEquallyMember)
            alert("Successfully update.") 
            navigation.navigate('Item Information',{eid:Itemid, allowToEdit:true, gid:gid})
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
                onEndEditing={()=> {
                    const roundedValue = parseFloat(ItemPrice).toFixed(2)
                    console.log(roundedValue)
                    setItemPrice(roundedValue)
                }}
                />
            </View>
            
            <Text style={Styles.textInputHeader}>Creditor</Text>
            <SelectDropdown
                data={memberList}
                ref={dropdown}
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
                    onPress={value => {setMethod(value)}}
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

    const ListHeader = (
        <View style={{marginLeft:10}}>
            {SetItemInfo}
            <View style={{paddingTop:10}}>
                <Text style={Styles.textInputHeader}>Debtor</Text>
                <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
            </View>
        </View>
    )

    function checkpercent(percent, oldVal=0) {
        let percenttotal = total.percent - oldVal;
        if (percenttotal+Number(percent) > 100) {
            alert("The percent for this debtor will limit to "+(100-percenttotal)+"\nto not go exceeded the expense price.");
            return {percenttotal:100,percent:100-percenttotal};
        }else {
            return {percenttotal:percenttotal+Number(percent),percent:Number(percent)};
        }
    }
    
    function checkprice(price, oldVal=0) {
        let pricetotal = total.price - oldVal;
        if (pricetotal+Number(price) > Number(ItemPrice)) {
            alert("The price for this debtor will limit to "+(Number(ItemPrice)-pricetotal)+"\nto not go exceeded the expense price.");
            return {pricetotal:Number(ItemPrice),price:Number(ItemPrice)-pricetotal};
        }else {
            return {pricetotal:pricetotal+Number(price),price:Number(price)};
        }
    }

    function crudOfDebtor(checker,uid, price, percentage){

        let debtorListTemp = Debtor;
        const isSplitEqually_debtor = (isSplitEqually ? true : (price > 0 ? false: true));
        let totalTemp = {price:0,percent:0};
        let update = {price:0,percent:0}
        if(checker){
            const index = debtorListTemp.findIndex((obj => obj.uid == uid));
            
            if(index >= 0){
                const Numprice = checkprice(price, debtorListTemp[index].priceToPay);
                const Numpercentage = checkpercent(percentage, debtorListTemp[index]["percentage (%)"]);

                debtorListTemp[index].priceToPay = Numprice.price;
                debtorListTemp[index].isSplitEqually = isSplitEqually_debtor;
                debtorListTemp[index]["percentage (%)"] = Numpercentage.percent;

                totalTemp.price = Numprice.pricetotal;
                totalTemp.percent = Numpercentage.percenttotal;
                update.price = Numprice.price;
                update.percent = Numpercentage.percent;
            }
            else{
                const Numprice = checkprice(price);
                const Numpercentage = checkpercent(percentage);

                debtorListTemp.push({uid:uid, isSplitEqually:isSplitEqually_debtor, priceToPay:Numprice.price,'percentage (%)':Numpercentage.percent});
                
                totalTemp.price = Numprice.pricetotal;
                totalTemp.percent = Numpercentage.percenttotal;
                update.price = Numprice.price;
                update.percent = Numpercentage.percent;
            }
        }else{
            const index = debtorListTemp.findIndex((obj => obj.uid == uid));

            totalTemp.price = total.price - debtorListTemp[index].priceToPay;
            totalTemp.percent = total.percent - debtorListTemp[index]["percentage (%)"];
            debtorListTemp = debtorListTemp.filter(debtor => debtor.uid != uid);
        }

        setDebtor(debtorListTemp);
        setTotal(totalTemp);

        console.log("pricetotal ", totalTemp.price, "percenttotal ", totalTemp.percent);
        console.log("selected debtor",debtorListTemp);

        return update
        
    }

    function Checkbox({item, index}){
        const [checker, setChecker] = useState(false);
        const [price, setCheckboxPrice] = useState('');
        const [percentage, setPercentage] = useState('');
        const data = item;

        let setpercent = (ItemPrice > 0 ? (price > 0 ? (Math.round(price/ItemPrice * 100) < 1 ? '<1': Math.round(price/ItemPrice * 100)) : 0):'...');
        let setprice = (ItemPrice > 0 ?(percentage > 0 ? Math.round(((ItemPrice * percentage / 100)+Number.EPSILON)*100)/100 : 0):'...');

        return(
            <View style ={{flex: 1, paddingHorizontal:20}} >
                <TouchableOpacity 
                    onPress={()=>{
                        if(ItemPrice<=0){alert("Please insert the price of this expense.")}
                        else {
                            crudOfDebtor(!checker, data.uid,price, percentage)
                            setChecker(!checker)
                            if(checker){setCheckboxPrice(''); setPercentage('')}
                        }
                    }}
                >
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
                        <Image style={{borderRadius: 50, height:35, width:35,margin:6.5 }} source={{uri:item.image}}/>
                        <Text style={Styles.item}>{item.name}</Text>
                    </View>
                    <View style={[Styles.itemInputCheckboxPrice, {marginRight:20,alignSelf:'center', flexDirection:'row',justifyContent:'space-around'}]}>
                        <View style={{width:'50%'}}>
                            <TextInput
                                style={{marginLeft:5}}
                                value={price}
                                editable={!isSplitEqually && ItemPrice>0}
                                keyboardType={'numeric'}
                                placeholder={String(setprice)}
                                onChangeText={(text) => {setCheckboxPrice(text)}}
                                onEndEditing={(e)=> {
                                    const roundedValue = parseFloat(price).toFixed(2); 
                                    const update = crudOfDebtor(checker,data.uid,roundedValue,(setpercent == "<1"|| setpercent == "..."? 0:setpercent)).price
                                    setCheckboxPrice(String(update));
                                }}
                                onPressIn={()=>{
                                    setChecker(true);
                                    setPercentage("");
                                }}
                            />
                        </View>
                        <View style={{width:'50%', flexDirection:'row'}}>
                            <TextInput
                                value={percentage}
                                maxLength={3}
                                editable={!isSplitEqually && ItemPrice>0}
                                keyboardType={'numeric'}
                                placeholder={String(setpercent)}
                                onChangeText={(text) => {
                                    setPercentage(text)
                                //     console.log("percentage",percentage)
                                }}
                                onEndEditing={(e)=> {
                                    const roundedValue = parseFloat(percentage).toFixed(0); 
                                    const update = crudOfDebtor(checker,data.uid,(setprice == "<1" || setprice == "..."? 0:setprice),roundedValue).percent
                                    setPercentage(String(update));
                                }}
                                onPressIn={(e)=>{
                                    setChecker(true)
                                    setCheckboxPrice("")
                                }}
                            />
                            <Text style={{alignSelf:'center', marginBottom:5,}}>%</Text>
                        </View>
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
    const memoizedRenderItem = useMemo(() =>{
        return Checkbox;
    },[Checkbox,isSplitEqually, ItemPrice, Debtor])

    return(
        <View style={[Styles.containeraddex,Styles.shadowProp]}>
            <SafeAreaView style={Styles.list_container}><SectionList
                sections={[
                    {title: 'Select the debtor', data: memberList},
                ]}
                renderItem={ memoizedRenderItem }
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