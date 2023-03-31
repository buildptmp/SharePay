import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image, SafeAreaView, SectionList, TouchableWithoutFeedback } from "react-native";
import { Styles } from "../Styles"
import { updateDebtStatus, checkAllowToleave, sendDebtClearNoti } from "../../database/DBConnection";
import SelectDropdown from "react-native-select-dropdown";
import { useRef } from "react";
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import LoadingModal from '../components/LoadingModal';

export default function ExpenseDetail({ page, navigation, route}) {
    const { detail, DebtOrDebtor, DebtOrDebtorName, DebtOrDebtorId, group, currUser} = route.params;
    const [editDebtStatusList, setEditStatusList] = useState([])

    const [isLoading, setIsLoading] = useState(false);

    const EditDebtStatusBtn = () => {
        return(
            <View>
                {
                    DebtOrDebtor == "Debtor" &&
                    <TouchableOpacity style={[Styles.btn,{width:100, alignSelf:'flex-end', margin:10}]}
                        onPress={async() => {
                            // PopupConfirm
                            await handleButtonClick()
                            // PopupSuccess
                        }}
                    >
                        <Text style={Styles.text}> Save </Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    const handleButtonClick = async() => {
        setIsLoading(true);
        await _saveEditDebtStatus();
        alert("Update success");
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        navigation.goBack();
    };

    async function _saveEditDebtStatus(){
        if(editDebtStatusList.length>0){
            for(item of editDebtStatusList){
                await updateDebtStatus(item.eid,DebtOrDebtorId,item.priceToPay,DebtOrDebtorName,item.debtstatus)//Debtor
            }

            for(uid of [DebtOrDebtorId,currUser.uid]){
                const check = await checkAllowToleave(uid,group.gid)
                
                if(check.creditor && check.debtor){
                    await sendDebtClearNoti(uid,group.gid,group.name)
                    if(uid==currUser.uid){
                        global.NotiSignal = true
                    }
                }
            }
        } else {
            // PopupNothing to be changed
        }
    }

    function crudOfEditDebtStatus(eid, priceToPay, statusChangeTo, status){
        let temp = editDebtStatusList;

        const index = temp.findIndex((obj => obj.eid == eid))
        if(index>=0 && status==statusChangeTo){// del from edit list if owed
            temp = temp.filter(obj => obj.eid != eid)
        } else if(index<0 && status != statusChangeTo) {// add to edit list if paid
            temp.push({eid:eid,priceToPay:priceToPay,debtstatus:statusChangeTo})
        }
        
        setEditStatusList(temp)
        console.log(temp)
    }

    const ListHeader = (
        <View style={[Styles.box,{justifyContent:'space-between', flexDirection:'row', backgroundColor:'#F88C8C'}]}>
            <Text style={Styles.sectionHeaderDebtDebtorList}>{DebtOrDebtor}: {DebtOrDebtorName}</Text>
            <Text style={Styles.sectionHeaderDebtDebtorList}>Group: {group.name}</Text>
        </View>
    )

    RenderItem = ({item}) =>{
        const ref = useRef("")
        const [status, setStatus] = useState(item.debtStatus)
        const debtorStatus = ['owed','paid']
        // const [editStatus, setEditStatus] = useState(true)
        let editStatus = true
        return(
            <TouchableWithoutFeedback style ={{flex: 1}}>
                <View style={[Styles.box,{justifyContent:'space-between'}]}>
                    {/* <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/> */}
                    
                    <Text style={Styles.debttext1}>{item.itemName}</Text>
                    <SelectDropdown
                        ref={ref}
                        disabled={editStatus}
                        // defaultButtonText={status}
                        defaultValue={status}
                        data={debtorStatus}
                        onSelect={(selectedItem) => {
                            setStatus(selectedItem)
                            crudOfEditDebtStatus(item.eid,item.priceToPay,selectedItem, item.debtStatus)
                        }}
                        buttonTextAfterSelection={(selectedItem) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item) => {
                            return item
                        }}
                        
                        buttonStyle={Styles.dropdownBtnStyle2}
                        buttonTextStyle={Styles.dropdownBtnTxtStyle2}
                    />
                    {
                        DebtOrDebtor == "Debtor" &&
                        <AntDesign 
                            name='edit'
                            size={18}
                            style={{alignItems:'center', marginTop:5}}
                            onPress={()=>{
                                editStatus = false
                                ref.current.openDropdown()
                            }}
                        />
                    }
                    {/* <Text style={[Styles.debttext2, {textAlign:'center'}]}>{item.debtStatus}</Text> */}
                    <Text style={Styles.debttext3}>{item.priceToPay}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return(
        <SafeAreaView style={Styles.list_container}>
            {detail && <SectionList
                style={{height:'100%'}}
                sections={[
                    {title: DebtOrDebtor+": "+DebtOrDebtorName , data: detail},
                ]}
                renderItem={({item}) => 
                    <RenderItem item={item} />
                }
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({section}) => (
                    <View style={[Styles.box,{justifyContent:'space-between'}]}>
                        <Text style={Styles.debttext1}>Expense name</Text>
                        <Text style={[Styles.debttext2,{borderLeftWidth:1,borderRightWidth:1,width:'40%'}]}>Status</Text>
                        <Text style={Styles.debttext3}>Amount</Text>
                    </View>
                )}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={<EditDebtStatusBtn />}
            />}  
            <LoadingModal visible={isLoading} />
        </SafeAreaView>
    )
}