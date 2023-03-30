import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { View, 
    Text, 
    Button, 
    StyleSheet, 
    TouchableOpacity, 
    Image, SectionList, 
    SafeAreaView, 
    RefreshControl, 
    Pressable
} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorListAllGroup } from "../../database/DBConnection";
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings'
import SelectDropdown from 'react-native-select-dropdown'
import { async } from "@firebase/util";
import { ScrollView } from "react-native-gesture-handler";
import { updateRating } from "../../database/DBConnection";


export default function DebtView({page, navigation}){
    const [debtorList, setDebtorList] = useState([]);
    const [debtList, setDebtList] = useState([]);
    const [isDebtAcitve, setDebtAcitve] = useState(true);
    const [isDebtorAcitve, setDebtorAcitve] = useState(false);
    const [isLoading, setLoading] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = React.useCallback(() => {
        const uid = auth().currentUser.uid
        setRefreshing(true);
        setTimeout(async() => {
            await _showDebtAndDebtorList(uid)
            setRefreshing(false);
        }, 2000);
    }, []);
    
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
        _showDebtAndDebtorList(uid);
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
            <ScrollView
                style={{width:'100%'}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>
                {
                    (isDebtAcitve && !isLoading) && <DebtList data={debtList} />
                }

                {
                    (isDebtorAcitve && !isLoading) && <DebtorList data={debtorList} />
                }
            </ScrollView>
        </SafeAreaView>
    );
};

function DebtList({data, page}) {
    const navigation = useNavigation();
    const currentUser = auth().currentUser
    const currname = currentUser?.displayName
    const uid = currentUser?.uid

    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,fontSize:18, marginBottom:5,}} key={e+index}>{e.title}</Text>
                        { e.data && e.data.map((r,index) => {
                            return (
                                <TouchableOpacity style={Styles.box} key={r+index} onPress={()=>{navigation.navigate('Detail',{detail: r.detail, DebtorDebtor: "Creditor", gname:e.title, DebtorDebtorName:r.creditorName})}}>
                                    <Text key={r.creditorName} style={Styles.debttext1}>{r.creditorName}</Text>
                                    <Text key={r.debtStatus} style={Styles.debttext2}>{r.debtStatus}</Text>
                                    <Text key={r.totolPrice} style={Styles.debttext3}>{r.totolPrice}</Text> 
                                    <TouchableOpacity 
                                        key={r+"Add Slip"}
                                        style={Styles.btnaddslip}
                                        onPress={() => {
                                            navigation.navigate('Add Slip', {amount:r.totolPrice, timestamp:r.timestamp, slipURL:r.slip, data:{detail: r.detail, group:{gid:r.gid,name:e.title},from:{uid:uid,name:currname}, to:{uid:r.creditorid,name:r.creditorName}}})
                                        }}
                                    >
                                        <Text style={Styles.text}>{r.slip ? "Check Slip":"Add slip"}</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </SafeAreaView>
    )
}

function DebtorList({data, uid}) {
    const navigation = useNavigation();
    const [rating, setRating] = useState(null);
    const [ratedByUser, setRatedByUser] = useState(false);

    const handleRating = async (rating) => {
        await updateRating(uid, rating);
        setRatedByUser(true);
      };
    
      if (ratedByUser) {
        return null;
      }


    // const [debtStatus, setdebtStatus] = useState("");
    // const [showDebtorRating, setShowDebtorRating] = useState(false);

    // useEffect(() => {
    //         if(debtStatus === 'paid'){
    //             setShowDebtorRating(true);
    //             }
    //         else {
    //             setShowDebtorRating(false);
    //         }
    // }, [debtStatus]);

    return (
        <SafeAreaView>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10, fontSize:18, marginBottom:5,}}>{e.title}</Text>
                        { e.data && e.data.map((t,index) => {
                            return (
                                <View style={{backgroundColor:'white',}}>
                                <TouchableOpacity style={[Styles.box,{borderBottomColor:'white'}]} 
                                    key={t+index} 
                                    onPress={()=>{navigation.navigate('Detail',{detail: t.detail, DebtorDebtor: "Debtor", gname:e.title, DebtorDebtorName:t.debtorName, DebtorDebtorId:t.debtorid})}}
                                >
                                    <Text key={t.debtorName} style={Styles.debttext1}>{t.debtorName}</Text>
                                    <Text key={t.debtStatus} style={Styles.debttext2}>{t.debtStatus}</Text>
                                    <Text key={t.totolPrice} style={Styles.debttext3}>{t.totolPrice}</Text>
                                    <Pressable 
                                        key={t+"Add Slip"}
                                        disabled={t.slip? false:true}
                                        style={t.slip? Styles.btnaddslip:[Styles.btnaddslip,{backgroundColor:'lightgray'}]}
                                        onPress={() => {
                                            navigation.navigate('Add Slip', {amount:r.totolPrice, timestamp:r.timestamp, slip:r.slip, data:{detail: r.detail, group:{gid:r.gid,name:e.title},from:{uid:uid,name:currname}, to:{uid:r.creditorid,name:r.creditorName}}})
                                        }}
                                    >
                                        <Text style={Styles.text}>Check Slip</Text>
                                    </Pressable>
                                </TouchableOpacity>

                                
                                { t.debtStatus === 'owed' && 
                                //<Text> Please rate the debtor </Text>
                                <AirbnbRating
                                    key={t='rating'}
                                    ratingContainerStyle={{backgroundColor:'white', paddingBottom:10,}}
                                    reviews={['Very Bad','Bad','Good','Very Good','Excellent']}
                                    count={5}
                                    defaultRating={1}
                                    size={25}
                                    reviewSize={14}
                                    reviewColor='#F88C8C'
                                    showRating={true}
                                    rating={rating}
                                    onFinishRating={(rating) =>{
                                        setRating(rating)
                                        handleRating(rating)
                                    }}
                                />}


                                {/* { t.debtStatus === 'paid' && 
                                <TouchableOpacity 
                                    style={Styles.btnrate}
                                    //onPress={()}
                                >
                                    <Text style={Styles.text}> Confirm </Text>
                                </TouchableOpacity> } */}
                                </View>
                                
                            )
                        })
                        }
                        {/* if(debtStatus === 'paid'){
                            
                                    
                            } */}
                        
                        
                        {/* <TouchableOpacity 
                            style={Styles.btnginfo}
                            onPress= {(Rating)}
                            >
                            <Text style={Styles.text}> Show Rating </Text>
                        </TouchableOpacity> */}
                        
                    </React.Fragment>
                )
            })}
        </SafeAreaView>
    )
}