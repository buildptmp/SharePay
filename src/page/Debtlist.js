import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, SectionList, SafeAreaView} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorListAllGroup } from "../../database/DBConnection";
import { useNavigation } from '@react-navigation/native';
import AddingSlip from "./AddingSlip";

export default function DebtView({page, navigation}){
    const [debtorList, setDebtorList] = useState([]);
    const [debtList, setDebtList] = useState([]);
    const [isDebtAcitve, setDebtAcitve] = useState(true);
    const [isDebtorAcitve, setDebtorAcitve] = useState(false);
    const [isLoading, setLoading] = useState(true);

    async function _showDebtAndDebtorList(uid){
        const listof = await getPersonalDebtAndDebtorListAllGroup(uid);

        if(listof.havedata){
            setDebtorList(listof.debtor);
            setDebtList(listof.debt);
            setLoading(false);
        } else {
            setLoading(true);
        }
        
        //console.log('Debtor: ', listof.debtor[0].data)
        //console.log('Debt: ', listof.debt[0].data)
    }

    useEffect(() => {
        const uid = auth().currentUser.uid;
        if (!uid) return;
        _showDebtAndDebtorList(uid)
    }, [auth().currentUser.toString, isDebtAcitve, isDebtorAcitve, isLoading])

    return(
        <SafeAreaView style={{backgroundColor: '#F6EFEF'}}>
            <View style={Styles.containerdlist}>
            <TouchableOpacity
                onPress={() => {
                    setDebtAcitve(true);
                    setDebtorAcitve(false);
                }}
                style={[Styles.btnlist, isDebtAcitve && Styles.selected]}
            >
                <Text style={Styles.text}>Debt List</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setDebtAcitve(false);
                    setDebtorAcitve(true);
                }}
                style={[Styles.btnlist, isDebtorAcitve && Styles.selected]}
            >
                <Text style={Styles.text}>Debtor List</Text>
            </TouchableOpacity>
            </View>

            {
                (isDebtAcitve && !isLoading) && <DebtList data={debtList} />
            }

            {
                (isDebtorAcitve && !isLoading) && <DebtorList data={debtorList} />
            }
        </SafeAreaView>
    );
};

function DebtList({data, page}) {
    const navigation = useNavigation();
    const RouteMapping = [
        { routeName: 'Add Slip', displayText: 'Add Slip'},
    ]
    
    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,fontSize:18, marginBottom:5,}} key={e+index}>{e.title}</Text>
                        { e.data && e.data.map((r,index) => {
                            return (
                                <TouchableOpacity style={Styles.box} key={r+index} onPress={()=>{navigation.navigate('Detail',{detail: r.detail, DebtorDebtor: "Debt", gname:e.title, DebtorDebtorName:r.creditorName})}}>
                                <Text key={r.creditorName} style={Styles.debttext1}>{r.creditorName}</Text>
                                <Text key={r.debtStatus} style={Styles.debttext2}>{r.debtStatus}</Text>
                                <Text key={r.calPrice}>{r.calPrice}</Text>
                                <Text key={r.totolPrice} style={Styles.debttext3}>{r.totolPrice}</Text> 
                                {RouteMapping.map((g, index) => {
                                    return(
                                <TouchableOpacity 
                                    key={g.routeName}
                                    style={Styles.btnaddslip}
                                    onPress={() => navigation.navigate(g.routeName)}
                                >
                                    <Text style={Styles.text}>{g.displayText}</Text>
                                </TouchableOpacity>
                                )
                                })}
                                </TouchableOpacity>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </SafeAreaView>
    )
}

function DebtorList({data}) {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10, fontSize:18, marginBottom:5,}}>{e.title}</Text>
                        { e.data && e.data.map((t,index) => {
                            return (
                                <TouchableOpacity style={Styles.box} key={t+index} onPress={()=>{navigation.navigate('Detail',{detail: t.detail, DebtorDebtor: "Debtor", gname:e.title, DebtorDebtorName:t.debtorName})}}>
                                <Text key={t.debtorName} style={Styles.debttext1}>{t.debtorName}</Text>
                                <Text key={t.debtStatus} style={[Styles.debttext2, {textAlign:'center'}]}>{t.debtStatus}</Text>
                                <Text key={t.totolPrice} style={[Styles.debttext3,{width:'30%', textAlign:'right'}]}>{t.totolPrice}</Text>
                                </TouchableOpacity>
                            )
                        })
                        }
                    </React.Fragment>
                )
            })}
        </SafeAreaView>
    )
}

// const DebtList = ({
//     children,
//     label,
//     values,
//     selectedValue,
//     setSelectedValue,
// }) => (
//     <View>
//     <View style={Styles.containerdlist}>
//         {values.map(value => (
//             <TouchableOpacity
//             key={value}
//             onPress={() => setSelectedValue(value)}
//             style={[Styles.btnlist, selectedValue === value && Styles.selected]}>
//                 <Text
//                 style={[
//                 Styles.text,
//                 selectedValue === value && Styles.selectedLabel,
//                 ]}>
//                 {value}
//                 </Text>
//             </TouchableOpacity>
//         ))}
//     </View>
//         <View style={[Styles.containerdlist2, {[label]: selectedValue}]}>{children}</View> 
//     </View>
// );

