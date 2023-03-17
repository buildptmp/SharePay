import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef, useMemo } from "react";
import { 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Modal,
    Button,
    Pressable
 } from "react-native";
import SectionList from 'react-native/Libraries/Lists/SectionList';
import SelectDropdown from 'react-native-select-dropdown'
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { Tooltip } from 'react-native-elements';
import {addExpense, addDebtor, getMemberListByGid, editExpenseAfterView} from '../../database/DBConnection'
import SwitchSelector from 'react-native-switch-selector';
// import TooltipAddingExpense from '../components/TooltipAddingExpense';

export default function AddingExpense({ route, navigation }) {
    const { gid, gname, itemInfo, isUpdate} = route.params  
    const [memberList, setMemberList] = useState([]);
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState("");
    const [Creditor, setCreditor] = useState({uid:""});
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

    const [modalVisible, setModalVisible] = useState(false);
    const [isaccept, setIsAccept] = useState(false);

    useEffect(() => {
        seeMember()
        // console.log(itemInfo)
        if (isUpdate){
            // console.log("Before",ItemName,ItemPrice,Creditor.name,isSplitEqually, Itemid, Debtor)
            // console.log("After",itemInfo)
            setItemName(itemInfo.name);
            setItemPrice(itemInfo.price);
            setItemID(itemInfo.eid);
            setCreditor(itemInfo.creditor);
            const index = memberList.findIndex((obj => obj.uid == itemInfo.creditor.uid));
            dropdown.current.selectIndex(index);
            setMethod(itemInfo.method == "Split Equally" ? true: false);

            console.log("update ", itemInfo.eid);
        }
    },[itemInfo])

    async function _addExpense(isaccepted){
        const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
        const check = checkCompleteForm(ItemName,ItemPrice,Creditor.uid,methodName, Debtor)
        if(check){
            if(isaccepted){
                const countSplitEquallyMember = await _countSplitEquallyMember(Debtor);
                if(total.percent == 100 || countSplitEquallyMember>=1){
                    const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid, methodName,gid);
                    await addDebtor(Debtor,itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember);
                    
                    alert("Successfully added.")
                    navigation.navigate('Item Information',{eid:itemid, allowToEdit:true, gid:gid, gname:gname})
                }
                else{
                    alert("Warn! The total price is "+ total.price+" (THB). \nadd more "+ (Number(ItemPrice)-total.price) +" (THB) or select more debtor without insert a number to set them in the Splitting equally for the rest.")
                }
            } else{
                setModalVisible(true)
            }
        }
    }
    
    async function _updateExpense(isaccepted){
        const methodName = (isSplitEqually ? "Split Equally" : "Split Unequally")
        const check = checkCompleteForm(ItemName,ItemPrice,Creditor.uid,methodName, Debtor)
        if(check){
            if(isaccepted){
                const countSplitEquallyMember = await _countSplitEquallyMember(Debtor);
                if(total.percent == 100 || countSplitEquallyMember>=1){
                    await editExpenseAfterView(Itemid, ItemName,ItemPrice,Creditor.uid,Debtor,gid);
                    await addDebtor(Debtor,Itemid,gid,Creditor.uid,ItemPrice, countSplitEquallyMember)

                    alert("Successfully update.") 
                    navigation.navigate('Item Information',{eid:Itemid, allowToEdit:true, gid:gid, gname:gname})
                }
                else{
                    alert("Warn! The total price is "+ total.price+" (THB). \nadd more "+ (Number(ItemPrice)-total.price) +"(THB) or select more debtor without insert a number to set them in the Splitting equally for the rest.")
                }
            } else{
                setModalVisible(true)
            }
        }
    }

    const Popup = (props) => {
        
        const isaddexpense = props.funcbut
        return(
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={()=>{
                setModalVisible(false);
            }}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <Text style={{textAlign:'center'}}>A decimal number that has more than two decimal point will be rounded up.</Text>
                    <Text>This would benefit to creditor.</Text>
                    <View style={{justifyContent:'center', margin:10}}>
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'80%'}}>
                        <TouchableOpacity 
                            style={Styles.btnpopup}
                            onPress={()=>{
                                // console.log(isaccept);
                                setIsAccept(true);
                                setModalVisible(false);
                                (isaddexpense ? _addExpense(true): _updateExpense(true))
                            }} 
                            
                        >
                            <Text style={Styles.text}>accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={Styles.btnpopup}
                            onPress={()=>{
                                setIsAccept(false);
                                // console.log(isaccept);
                                setModalVisible(false);
                            }} 
                        >
                            <Text style={Styles.text}>decline</Text>
                        </TouchableOpacity>
                        </View>    
                    </View>
                    <Text>Please select accept to continue.</Text>
                </View>

            </View>
        </Modal>
    )}
    

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
                    const roundedValue = parseFloat((ItemPrice? ItemPrice: 0)).toFixed(2)
                    // console.log(roundedValue)
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
                    return(<Fontisto name="search"/>);
                }}
                buttonStyle={Styles.dropdownBtnStyle}
                buttonTextStyle={Styles.dropdownBtnTxtStyle}
                renderDropdownIcon={(selectedItem) => {
                    return (<Fontisto name={selectedItem ? 'angle-up':'angle-down'}/>);
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={Styles.dropdownDropdownStyle}
                rowStyle={Styles.dropdownRowStyle}
                rowTextStyle={Styles.dropdownRowTxtStyle}
            />
            
            <View>
                <Text style={Styles.textInputHeader}>Splitting Method</Text>
                <SwitchSelector
                    initial={0}
                    onPress={value => {setMethod(value)}}
                    textColor={'#F88C8C'} //'#7a44cf'
                    selectedColor={'#fff'}
                    buttonColor={'#F88C8C'}
                    borderColor={'#F88C8C'}
                    disabled={(Debtor.length > 0)}
                    hasPadding
                    style={{width:'60%'}}
                    options={[
                        { label: "Split Equally", value: true}, 
                        { label: "Split Unequally", value: false} 
                    ]}
                    testID="gender-switch-selector"
                    accessibilityLabel="gender-switch-selector"
                /> 
                <Text style={{ marginLeft:10}}>Remove all debtors to change the splitting method.</Text>
            </View>  
        </View>
    )

    const ListHeader = (
        <View style={{marginLeft:10}}>
            {SetItemInfo}
            <View style={{paddingTop:10}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={Styles.textInputHeader}>Debtor  </Text> 
                    {
                        !isSplitEqually && <Tooltip ModalComponent={Modal} popover={<Text>If you want some debtor to share the rest of the price, you can select them and let their price freedom. SharePay will set the debtors with the price in zero to share and split equally for the rest of the price.</Text>} 
                            containerStyle={{borderColor:"#F88C8C", borderWidth:1.5, backgroundColor:'#F6EFEF', margin:5, height:130,width:250}}>
                            <Feather name="alert-circle"/>
                        </Tooltip>
                    }
                    
                </View>
                <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
            </View>
        </View>
    )

    function checkpercent(percent, oldVal=0) {
        let percenttotal = total.percent - Number(oldVal);
        if (percenttotal+Number(percent) > 100) {
            alert("The percent for this debtor will limit to "+(100-percenttotal)+"\nto not exceed the expense price.");
            return {percenttotal:100,percent:100-percenttotal};
        }else {
            return {percenttotal:percenttotal+Number(percent),percent:Number(percent)};
        }
    }
    
    function checkprice(price, oldVal=0) {
        let pricetotal = total.price - Number(oldVal);
        if (pricetotal+Number(price) > Number(ItemPrice)) {
            alert("The price for this debtor will limit to "+(Number(ItemPrice)-pricetotal)+"\nto not exceed the expense price.");
            return {pricetotal:Number(ItemPrice),price:Number(ItemPrice)-pricetotal};
        }else {
            // console.log({pricetotal:pricetotal+Number(price),price:Number(price)})
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

        console.log("pricetotal "+ totalTemp.price + ", percenttotal "+ totalTemp.percent);
        console.log("selected debtor", debtorListTemp);

        return update
        
    }

    function Checkbox({item, index}){
        const [checker, setChecker] = useState(false);
        const [price, setCheckboxPrice] = useState('');
        const [percentage, setPercentage] = useState('');
        const data = item;
        const priceInputRef = useRef(null);
        const percentageInputRef = useRef(null);

        let setpercent = (ItemPrice > 0 ? (price > 0 ? (Math.round(price/ItemPrice * 100) < 1 ? '<1': Math.round(price/ItemPrice * 100)) : 0):'...');
        let setprice = (ItemPrice > 0 ? (percentage > 0 ? Math.round(((ItemPrice * percentage / 100)+Number.EPSILON)*100)/100 : 0):'...');

        const handlePriceInputPress = () => {
            if (priceInputRef.current) {
                priceInputRef.current.focus();
            }
            setChecker(true);
            setPercentage("");
        };
    
        const handlePercentageInputPress = () => {
            if (percentageInputRef.current) {
                percentageInputRef.current.focus();
            }
            setChecker(true)
            setCheckboxPrice("")
        };

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
                        <Fontisto name={(checker ? 'checkbox-active':'checkbox-passive')} size={35} style={{margin:6.5, width:40}}></Fontisto>
                        <Image style={{borderRadius: 50, height:35, width:35,margin:6.5 }} source={{uri:item.image}}/>
                        <Text style={Styles.item}>{item.name}</Text>
                    </View>
                    <View style={[Styles.itemInputCheckboxContainer, {marginRight:10,alignSelf:'center', flexDirection:'row', justifyContent:'flex-end'}]}>
                        <TouchableOpacity disabled={isSplitEqually || ItemPrice<=0} style={[Styles.itemInputCheckboxBorder,{flexDirection:'row', marginRight:5, paddingRight:10, paddingLeft:10, width:'57%', justifyContent:'flex-end'}]} onPress={handlePriceInputPress}>
                            <TextInput
                                style={{paddingBottom:9, alignContent:'flex-end'}}
                                value={price}
                                ref={priceInputRef}
                                editable={!isSplitEqually && ItemPrice>0}
                                keyboardType={'numeric'}
                                placeholder={String(setprice)}
                                onChangeText={(text) => {setCheckboxPrice(text)}}
                                onEndEditing={(e)=> {
                                    const roundedValue = roundup2decimalpoint(price); 
                                    const update = crudOfDebtor(checker,data.uid,roundedValue,(setpercent == "<1"|| setpercent == "..."? 0:setpercent)).price
                                    setCheckboxPrice(String(update));
                                }}
                                onPressIn={()=>{
                                    setChecker(true);
                                    setPercentage("");
                                }}
                            />
                            <Text style={{alignSelf:'center', marginBottom:2,}}>THB</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={isSplitEqually || ItemPrice<=0} style={[Styles.itemInputCheckboxBorder,{flexDirection:'row',paddingRight:10, paddingLeft:10, width:'37%', justifyContent:'flex-end'}]} onPress={handlePercentageInputPress}>
                            <TextInput
                                style={{paddingBottom:9, alignContent:'flex-end'}}
                                value={percentage}
                                ref={percentageInputRef}
                                maxLength={3}
                                editable={!isSplitEqually && ItemPrice>0}
                                keyboardType={'numeric'}
                                placeholder={String(setpercent)}
                                onChangeText={(text) => {
                                    setPercentage(text)
                                //     console.log("percentage",percentage)
                                }}
                                onEndEditing={(e)=> {
                                    const roundedValue = parseFloat((percentage? percentage:0)).toFixed(0); 
                                    const update = crudOfDebtor(checker,data.uid,(setprice == "<1" || setprice == "..."? 0:setprice),roundedValue).percent
                                    setPercentage(String(update));
                                }}
                                onPressIn={(e)=>{
                                    setChecker(true)
                                    setCheckboxPrice("")
                                }}
                            />
                            <Text style={{alignSelf:'center', marginBottom:2}}>%</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        );
    }

    ListFooter = (props) => {
        return(
            <View>  
                <TouchableOpacity style={{flexDirection:'row', margin:10,}} onPress={()=>{
                        setIsAccept(!isaccept)
                    }}>
                    <Fontisto name={(isaccept ? 'checkbox-active':'checkbox-passive')} size={16} style={{margin:2, marginLeft:10, marginRight:5}}></Fontisto>
                    <Text>Accept the rounded up two decimal point.</Text>
                </TouchableOpacity>    
                    
            {
                isUpdate ? 
                <Pressable 
                    style={Styles.btnaddex}
                    onPress= {()=>_updateExpense(isaccept)}
                >
                    <Text style={Styles.text}>update Expense</Text>
                </Pressable> 
                :
                <Pressable 
                    style={Styles.btnaddex}
                    onPress= {()=> _addExpense(isaccept)} 
                >
                    <Text style={Styles.text}>Add Expense</Text>
                </Pressable>
            }
            </View>
        ) 
    }
    const memoizedRenderItem = useMemo(() =>{
        return Checkbox;
    },[Checkbox,isSplitEqually, ItemPrice, Debtor])

    return(
        <View style={[Styles.containeraddex,Styles.shadowProp]}>
            <SafeAreaView style={Styles.list_container}>
                <Popup funcbut={isUpdate ? false:true} />
                <SectionList
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
function checkCompleteForm(itemname, itemprice, creditorid, splitmethod, debtor){
    let textStart = "Please fill in the following field:\n"
    let field = ""
    if(!itemname) field+="   - Item Name\n";
    if(!itemprice) field+="   - Price (Baht)\n";
    if(!creditorid) field+="   - Creditor\n";
    // (splitmethod? null: field+="Splitting Method\n");
    if(!debtor.length > 0) field+="   - Debtor\n";

    if(field){
        alert(textStart +field+"\nbefore create an expense.")
        return false;
    }
    return true;
}
function roundup2decimalpoint(num){
    const numb = Number((num? num:0));
    const roundedValue = Math.ceil(numb*100)/100
    return roundedValue;
}