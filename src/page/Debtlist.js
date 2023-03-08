import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, SectionList, SafeAreaView} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorList } from "../../database/DBConnection";

export default function DebtView({page, navigation}){
    const [debtorList, setDebtorList] = useState([{}]);
    const [debtList, setDebtList] = useState([{}]);
    const [isDebtAcitve, setDebtAcitve] = useState(true);
    const [isDebtorAcitve, setDebtorAcitve] = useState(false);
    const [isLoading, setLoading] = useState(true);

    async function _showDebtAndDebtorList(uid){
        const list = await getPersonalDebtAndDebtorList(uid);
        setDebtorList(list[0]);
        setDebtList(list[1]);
        console.log('Debtor: ', list[0][0].data)
        console.log('Debt: ', list[1][0].data)
    }
    //console.log(debtorList[0].data)

    useEffect(() => {
        const uid = auth().currentUser.uid;
        if (!uid) return;
        _showDebtAndDebtorList(uid)

        if (debtList.length === 0 || debtorList.length === 0) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [auth().currentUser.toString, isDebtAcitve, isDebtorAcitve, isLoading])

    return(
        <SafeAreaView>
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

function DebtList({data}) {
    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,}} key={index}>{e.title}</Text>
                        { e.data && e.data.map((r) => {
                            return (
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10,}}>
                                <Text key={r.creditorName}>{r.creditorName}</Text>
                                <Text key={r.debtStatus}>{r.debtStatus}</Text>
                                <Text key={r.calPrice}>{r.calPrice}</Text>
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
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,}} key={index}>{e.title}</Text>
                        { e.data && e.data.map((t) => {
                            return (
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10,}}>
                                <Text key={t.debtorName}>{t.debtorName}</Text>
                                <Text key={t.debtStatus}>{t.debtStatus}</Text>
                                <Text key={t.calPrice}>{t.calPrice}</Text>
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

