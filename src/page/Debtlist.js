import React, { useState, useEffect } from "react";
import { View, 
    Text, 
    Button, 
    StyleSheet, 
    TouchableOpacity, 
    Image, SectionList, 
    SafeAreaView, 
    RefreshControl, 
    Pressable,
    ScrollView
} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorListAllGroup } from "../../database/DBConnection";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings'
import SelectDropdown from 'react-native-select-dropdown'
import { async } from "@firebase/util";

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

    // useEffect(() => {
    //     const uid = auth().currentUser.uid;
    //     if (!uid) return;
    //     _showDebtAndDebtorList(uid);
    // }, [auth().currentUser.toString, isDebtAcitve, isDebtorAcitve, isLoading])

    useFocusEffect(
        React.useCallback(() => {
            const uid = auth().currentUser.uid;
        if (!uid) return;
        _showDebtAndDebtorList(uid);
        },[auth().currentUser.toString, isDebtAcitve, isDebtorAcitve])
    )

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
        <SafeAreaView style={{paddingBottom:80}}>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,fontSize:18, marginBottom:5,}} key={e+index}>{e.title}</Text>
                        { e.data && e.data.map((r,index) => {
                            return (
                                <TouchableOpacity style={Styles.box} key={r+index} onPress={()=>{navigation.navigate('Detail',{detail: r.detail, DebtOrDebtor: "Creditor", group:{gid:r.gid,name:e.title}, DebtOrDebtorName:r.creditorName})}}>
                                    <Text key={r.creditorName} style={Styles.debttext1}>{r.creditorName}</Text>
                                    <Text key={r.debtStatus} style={Styles.debttext2}>{r.debtStatus}</Text>
                                    <Text key={r.totolPrice} style={Styles.debttext3}>{r.totolPrice}</Text> 
                                    <TouchableOpacity 
                                        key={r+"Add Slip"}
                                        style={Styles.btnaddslip}
                                        onPress={() => {
                                            navigation.navigate('Add Slip', {amount:r.totolPrice, timestamp:r.timestamp, slip:r.slip, data:{detail: r.detail, group:{gid:r.gid,name:e.title},from:{uid:uid,name:currname}, to:{uid:r.creditorid,name:r.creditorName}}})
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

function DebtorList({data}) {
    const navigation = useNavigation();
    const currentUser = auth().currentUser
    const currname = currentUser?.displayName
    const uid = currentUser?.uid

    return (
        <SafeAreaView style={{paddingBottom:80}}>
            {data.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10, fontSize:18, marginBottom:5,}} key={e+index}>{e.title}</Text>
                        { e.data && e.data.map((t,index) => {
                            return (
                                <View key={e+t+index} style={{backgroundColor:'white',}}>
                                <TouchableOpacity style={[Styles.box,{borderBottomColor:'white'}]} 
                                    key={t+index} 
                                    onPress={()=>{navigation.navigate('Detail',{detail: t.detail, DebtOrDebtor: "Debtor", DebtOrDebtorName:t.debtorName, DebtOrDebtorId:t.debtorid, group:{gid:t.gid,name:e.title},currUser:{uid:uid,name:currname}})}}
                                >
                                    <Text key={t.debtorName} style={Styles.debttext1}>{t.debtorName}</Text>
                                    <Text key={t.debtStatus} style={Styles.debttext2}>{t.debtStatus}</Text>
                                    <Text key={t.totolPrice} style={Styles.debttext3}>{t.totolPrice}</Text>
                                    <Pressable 
                                        key={t+"Add Slip"}
                                        disabled={t.slip? false:true}
                                        style={t.slip? Styles.btnaddslip:[Styles.btnaddslip,{backgroundColor:'lightgray'}]}
                                        onPress={() => {
                                            navigation.navigate('Add Slip', {amount:t.totolPrice, timestamp:t.timestamp, slip:t.slip, data:{detail: t.detail, group:{gid:t.gid,name:e.title},to:{uid:uid,name:currname}, from:{uid:t.debtorid,name:t.debtorName}}})
                                        }}
                                    >
                                        <Text style={Styles.text}>Check Slip</Text>
                                    </Pressable>
                                </TouchableOpacity>

                                
                                { t.debtStatus === 'paid' && 
                                //<Text> Please rate the debtor </Text>
                                <AirbnbRating
                                    key={t+"stars"}
                                    ratingContainerStyle={{backgroundColor:'white', paddingBottom:10,}}
                                    reviews={['Very Bad','Bad','Good','Very Good','Excellent']}
                                    count={5}
                                    defaultRating={1}
                                    size={25}
                                    reviewSize={14}
                                    reviewColor='#F88C8C'
                                    showRating={true}
                                    onFinishRating={(rating) => alert(rating)}
                                />}

                                { t.debtStatus === 'paid' && 
                                <TouchableOpacity 
                                    style={Styles.btnrate}
                                    key={t+"stars confirm"}
                                    //onPress={()}
                                >
                                    <Text style={Styles.text}> Confirm </Text>
                                </TouchableOpacity> }
                                </View>
                                
                            )
                        })
                        }                        
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

// function Rating({data}) {
//     const [defautRating, setdefaultRating] = useState(0)
//     const [maxRating, setmaxRating] = useState([1,2,3,4,5])

//     const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
//     const startImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'

//     const CustomRatingBar = () => {
//         return(
//             <View style={Styles.customRatingStyle}>
//                 { maxRating.map((item, key) => {
//                     return(
//                         <TouchableOpacity
//                         activeOpacity={0.7}
//                         key = {item}
//                         onPress={() => setdefaultRating(item)}
//                         >
//                             <Image
//                                 style={Styles.starImg}
//                                 source={
//                                     item <= defautRating
//                                         ? {uri: starImgFilled}
//                                         : {uri: startImgCorner}
//                                 }
//                             />

//                         </TouchableOpacity>
//                     )
//                 })}
//             </View>
//         )
//     }

//     return(
//         <SafeAreaView>
//             <Text> Please Rate! </Text>
//             <CustomRatingBar/>
//             <Text>
//                 {defautRating + ' / ' + maxRating.length}
//             </Text>
//             <TouchableOpacity
//                 activeOpacity={0.7}
//                 style = {Styles.ratBtn}
//                 onPress={() => alert(defautRating)}
//             >
//                 <Text> Get Selected Value </Text>

//             </TouchableOpacity>
//         </SafeAreaView>
//     );
// }
