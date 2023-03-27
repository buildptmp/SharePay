import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image, SafeAreaView, SectionList, TouchableWithoutFeedback } from "react-native";
import { Styles } from "../Styles"
import { updateDebtor } from "../../database/DBConnection";
import SelectDropdown from "react-native-select-dropdown";
import { useRef } from "react";
import AntDesign from 'react-native-vector-icons/AntDesign'; 

export default function ExpenseDetail({ page, navigation, route}) {
    const { detail, DebtorDebtor, gname, DebtorDebtorName, DebtorDebtorId} = route.params;
    
    // const EditDebtStatusBtn = () => {
    //     return(
    //         <View>
    //             <TouchableOpacity style={[Styles.btn,{width:150, alignSelf:'flex-end', margin:10}]}
    //             onPress = {() => setEditStatus(false)}
    //             >
    //                 <Text style={Styles.text}> Edit Debt Status </Text>
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }
    
    const ListHeader = (
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <Text style={Styles.sectionHeader}>{DebtorDebtor}: {DebtorDebtorName}</Text>
            <Text style={Styles.sectionHeader}>Group: {gname}</Text>
        </View>
    )

    RenderItem = (props) =>{
        const item = props.item
        const ref = useRef("")
        const [status, setStatus] = useState('owed')
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
                    <AntDesign 
                        name='edit'
                        size={18}
                        style={{alignItems:'center', marginTop:5}}
                        onPress={()=>{
                            editStatus = false
                            ref.current.openDropdown()
                        }}
                    />

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
                    {title: DebtorDebtor+": "+DebtorDebtorName , data: detail},
                ]}
                renderItem={({item}) => 
                    <RenderItem item={item} />
                }
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({section}) => (
                    <View style={[Styles.box,{justifyContent:'space-between'}]}>
                        <Text style={Styles.debttext1}>Expense name</Text>
                        <Text style={Styles.debttext2}>Status</Text>
                        <Text style={Styles.debttext3}>Amount</Text>
                    </View>
                )}
                // ListFooterComponent={<EditDebtStatusBtn />}
            />}  
        </SafeAreaView>
    )
}