import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image, SafeAreaView, SectionList, TouchableWithoutFeedback } from "react-native";
import { Styles } from "../Styles"
<<<<<<< HEAD
import SelectDropdown from 'react-native-select-dropdown'
import { updateDebtStatus } from "../../database/DBConnection";
//import { updateDebtor } from "../../database/DBConnection";

// const toEditStatus = () => {
    
// }



=======
import { updateDebtor } from "../../database/DBConnection";
import SelectDropdown from "react-native-select-dropdown";
>>>>>>> 480274a6322675a8b97d82c92f3aa7a7cece8f4d
export default function ExpenseDetail({ page, navigation, route}) {
    const { detail, DebtorDebtor, gname, DebtorDebtorName, DebtorDebtorId} = route.params;
    const [status, setStatus] = useState('owed')
    const debtorStatus = ['owed','paid']
    const [editStatus, setEditStatus] = useState(true)
    
    const editDebtStatusBtn = () => {
    return(
        <View>
            <TouchableOpacity style={Styles.btn}
            onPress = {() => setEditStatus(false)}
            >
                <Text style={Styles.text}> Edit Debt Status </Text>
            </TouchableOpacity>
        </View>
    )
}
    
    const ListHeader = (
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <Text style={Styles.sectionHeader}>{DebtorDebtor}: {DebtorDebtorName}</Text>
            <Text style={Styles.sectionHeader}>Group: {gname}</Text>
        </View>
    )

    return(
        <SafeAreaView style={Styles.list_container}>
            {detail && <SectionList
                style={{height:'100%'}}
                sections={[
                    {title: DebtorDebtor+": "+DebtorDebtorName , data: detail},
                ]}
                renderItem={({item}) => 
                    <TouchableWithoutFeedback style ={{flex: 1}} 
                    // onLongPress={()=>{
                    //     console.log(item.eid+":"+DebtorDebtorId)
                    //     updateDebtor(item.eid,DebtorDebtorId)
                    // }}
                    // onPress={() => {navigation.navigate('Item Information',{eid:item.eid, allowToEdit:false, gid:item.gid,gname:gname})}}
                        >
                        <View style={Styles.box}>
                            {/* <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/> */}
                            
                            <Text style={Styles.debttext1}>{item.itemName}</Text>
                            <SelectDropdown

                                disabled={editStatus}
                                defaultButtonText={item.debtStatus}
                                //defaultValue={status}
                                data={debtorStatus}
                                onSelect={(selectedItem) => {
                                    setStatus(selectedItem)
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

                            {/* <Text style={[Styles.debttext2, {textAlign:'center'}]}>{item.debtStatus}</Text> */}
                            <Text style={[Styles.debttext3,{width:'30%', textAlign:'right'}]}>{item.priceToPay}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({section}) => (
                    <View style={Styles.box}>
                        <Text style={Styles.debttext1}>Expense name</Text>
                        <Text style={[Styles.debttext2, {textAlign:'center'}]}>Status</Text>
                        <Text style={[Styles.debttext3,{width:'30%', textAlign:'right'}]}>Amount</Text>
                    </View>
                )}
                ListFooterComponent={<editDebtStatusBtn />}
            />
            }
                ListHeaderComponent={ListHeader}
                // ListFooterComponent={
                // <SelectDropdown
                //     data={['Owne', 'Paid']}
                //     onSelect={(item)=>{

                //     }}
                // >

                // </SelectDropdown>}
            />}
        </SafeAreaView>
    )
}


