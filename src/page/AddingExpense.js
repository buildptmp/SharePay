import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { useHistory } from "react-router-dom";
// import { createStackNavigator } from '@react-navigation/stack';
// import Homepage from './Homepage';
import { Styles } from "../Styles"
// import { NavigationScreenProps } from "react-navigation";
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
 } from "react-native";
//  import CheckBox from 'react-native-check-box';
import SectionList from 'react-native/Libraries/Lists/SectionList';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Fontisto';
// import Icon from 'react-native-vector-icons/AntDesign';
import {addExpense, addDebtor, getMemberListByGid} from '../../database/DBConnection'

 export default function AddingExpense({ route, navigation }) {
    const { gid, gname } = route.params
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [Creditor, setCreditor] = useState("");
    const [memberList, setMemberList] = useState([{}]);

    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]
    // const [isChecked, setIscheck] = useState({
    //     Build: false,
    //     Prai: false,
    //     Pop: false,
    // });
    // const dropdownRef = useRef({}); 

    // onPress={()=>{ dropdownRef.current.reset() }}; 

    async function seeMember(){
        const mList = await getMemberListByGid(gid);
        setMemberList(mList)
        // console.log(mList)
    } 
    useEffect(() => {
        seeMember()
    },[])
    
    const debtorList = [{uid:"1tmvjTfbUSRTCdTMldSpVZXhXLP2",isSplitEqully:false,percentage:50},
    {uid:"KAFwUHfoEBe1VQwXCcX1wxgYAfF2",isSplitEqully:true,percentage:0},
    {uid:"NZA9HHxQTmaGyANy0071ybo7WDr2",isSplitEqully:true,percentage:0},
    {uid:"dzbzw8RQeXX2jsnd0HHZ2P6txC22",isSplitEqully:true,percentage:0}
    ]
    function handleChange(item) {
        console.log(item)
      };
    /* 
    price = 200
    100
    33.34 * 3
    [{ "name": "J", "phoneNum": "+66979524698", "uid": "1tmvjTfbUSRTCdTMldSpVZXhXLP2"}, 
    {"name": "buildkin", "phoneNum": "+66959499155", "uid": "KAFwUHfoEBe1VQwXCcX1wxgYAfF2"}, 
    {"name": "Pop", "phoneNum": "+66972359505", "uid": "NZA9HHxQTmaGyANy0071ybo7WDr2"}, 
    {"name": "eieiza", "phoneNum": "+66123456789", "uid": "dzbzw8RQeXX2jsnd0HHZ2P6txC22"}]
    */
    async function _countSplitEquallyMember(debtors){
        let count = 0;
        for(debtor of debtors){ if(debtor.isSplitEqully) count++; }
        return count
    }

    async function _addExpense(){
        const itemid = await addExpense(ItemName,ItemPrice,Creditor.uid,gid);
        const countSplitEquallyMember = await _countSplitEquallyMember(debtorList);
        const debtorids = await addDebtor(debtorList,itemid,gid,creditorid,ItemPrice, countSplitEquallyMember)
    }

    // const Member = ["Buildkin", "Prai", "Pop"]
    return(
        
        <View style={Styles.containeraddex}>
            <View style={{ width: '100%', paddingHorizontal: 10, backgroundColor: '#F6EFEF',}}>
                <Text style={Styles.textboxtop}>Item Name</Text>
                <TextInput
                    style={Styles.inputaddex}
                    value={ItemName}
                    placeholder={"Insert item"}
                    onChangeText={(text) => setItemName(text)}
                    autoCapitalize={"none"}
                />
            </View>
            <View style={{ width: '100%', paddingHorizontal: 10, backgroundColor: '#F6EFEF',}}>
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
                    // defaultValue={Creditor}
                    data={memberList}
                    // ref={dropdownRef}
                    defaultButtonText={'Select a Creditor'}
                    onSelect={(selectedItem) => {
                        setCreditor(selectedItem)
                        // console.log(selectedItem.uid)
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
                    // buttonStyle={Styles.dropDownCredBtnStyle}
                />
                
                <View style={{alignSelf:'flex-start', paddingTop:10}}>
                    <Text style={Styles.sectionHeaderwithsub}>Debtor</Text>
                    <Text style={{paddingLeft: 10, paddingBottom: 2}}>Select the member who share this expense</Text>
                </View>
                        
                   
                {/* <CheckBox 
                isChecked={isChecked.Build} 
                onClick={()=> setIscheck(!isChecked)}
                rightText="Build"
                checkedCheckBoxColor='green'
                //uncheckedCheckBoxColor='red'
                /> */}
                <SafeAreaView style={Styles.list_container, {width:"100%"}}><SectionList
                    sections={[
                        {title: 'Select the debtor', data: memberList},
                    ]}
                    renderItem={({item, index}) => 
                        <TouchableOpacity style ={{flex: 1}} defaultValue={{uid:item.uid}} onPress={() => handleChange(item.uid)}>
                            <View style={{
                                width: '100%',
                                height: 50,
                                backgroundColor: '#FFFFFF',
                                borderBottomWidth: 1,
                                borderColor: '#7E828A',
                                flexDirection: 'row'
                                }}>
                                <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/>
                                <Text style={Styles.item}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => item + index}
                /></SafeAreaView>
                <TouchableOpacity 
                    style={Styles.btnaddex}
                    // onPress= {_addExpense}
                    
                >
                    <Text style={Styles.text}> Add Expense</Text>
                </TouchableOpacity>
            {/* </View> */}
        </View> 
    );
};

