import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image, SafeAreaView, SectionList } from "react-native";
import { Styles } from "../Styles"

export default function ExpenseDetail({ page, navigation, route}) {
    const { detail, DebtorDebtor, gname, DebtorDebtorName} = route.params;



    return(
        <SafeAreaView style={Styles.list_container}>
            {detail && <SectionList
                style={{height:'100%'}}
                sections={[
                    {title: DebtorDebtor+" ("+DebtorDebtorName+")" , data: detail},
                ]}
                renderItem={({item}) => 
                    <TouchableOpacity style ={{flex: 1}} onPress={() => 
                        navigation.navigate('Item Information',{eid:item.eid, allowToEdit:false, gid:item.gid,gname:gname})
                        }>
                        <View style={Styles.box}>
                            {/* <Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:item.image}}/> */}
                            
                            <Text style={Styles.debttext1}>{item.itemName}</Text>
                            <Text style={[Styles.debttext2, {textAlign:'center'}]}>{item.debtStatus}</Text>
                            <Text style={[Styles.debttext3,{width:'30%', textAlign:'right'}]}>{item.priceToPay}</Text>
                        </View>
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({section}) => (
                    <Text style={Styles.sectionHeader}>{section.title}</Text>
                )}
            />}
        </SafeAreaView>
    )
}

