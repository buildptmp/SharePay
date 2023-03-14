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
        }
        //console.log('Debtor: ', listof.debtor[0].data)
        //console.log('Debt: ', list[1][0].data)
        if (listof.havedata) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }
    //console.log(debtorList[0].data)

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

            {/* // <DebtList
            // values={['Debt list', 'Debtor list']}
            // // selectedValue={}
            // // setSelectedValue={}
            // >
            //     <View>
            //         <SectionList></SectionList>
            //     </View>

            // </DebtList> */}
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
                    <>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,fontSize:18, marginBottom:5,}} key={index}>{e.title}</Text>
                        { e.data && e.data.map((r) => {
                            return (
                                <View style={Styles.box}>
                                <Text key={r.creditorName} style={Styles.debttext1}>{r.creditorName}</Text>
                                <Text key={r.debtStatus} style={Styles.debttext2}>{r.debtStatus}</Text>
                                <Text key={r.calPrice}>{r.calPrice}</Text>
                                <Text key={r.totolPrice} style={Styles.debttext3}>{r.totolPrice}</Text> 
                                {RouteMapping.map((g) => {
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
                                </View>
                            )
                        })}
                    </>
                )
            })}
        </SafeAreaView>
    )
}

function DebtorList({data}) {
    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10, fontSize:18, marginBottom:5,}} key={index}>{e.title}</Text>
                        { e.data && e.data.map((t) => {
                            return (
                                <View style={[Styles.box, {width:'100%'}]}>
                                <Text key={t.debtorName} style={Styles.debttext1}>{t.debtorName}</Text>
                                <Text key={t.debtStatus} style={[Styles.debttext2, {textAlign:'center'}]}>{t.debtStatus}</Text>
                                <Text key={t.totolPrice} style={[Styles.debttext3,{width:'30%', textAlign:'right'}]}>{t.totolPrice}</Text>
                                </View>
                            )
                        })
                        }
                    </>
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

