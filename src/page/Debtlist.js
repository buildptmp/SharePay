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
    Pressable,
    ScrollView,
    Modal,
    ActivityIndicator
} from 'react-native';
import { Styles } from "../Styles"
import auth from '@react-native-firebase/auth'
import { getPersonalDebtAndDebtorListAllGroup, updateDebtRating, updateRating } from "../../database/DBConnection";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings'
import SelectDropdown from 'react-native-select-dropdown'
import { async } from "@firebase/util";
import LoadingModal from "../components/LoadingModal";

export default function DebtView({page, navigation}){
    const [debtorList, setDebtorList] = useState([]);
    const [debtList, setDebtList] = useState([]);
    const [isDebtAcitve, setDebtAcitve] = useState(true);
    const [isDebtorAcitve, setDebtorAcitve] = useState(false);
    const [isLoading, setLoading] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [LoadingModalVisible, setVisible] = useState(false);

    const handleRefresh = React.useCallback(() => {
        const uid = auth().currentUser.uid
        setRefreshing(true);
        setTimeout(async() => {
            await _showDebtAndDebtorList(uid)
            setRefreshing(false);
        }, 1000);
    }, []);
    
    async function _showDebtAndDebtorList(uid){
        setVisible(true);
        const listof = await getPersonalDebtAndDebtorListAllGroup(uid);

        if(listof.havedata){
            setDebtorList(listof.debtor);
            setDebtList(listof.debt);
            setLoading(false);
        } else {
            setLoading(true);
        }
        setVisible(false);
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
        },[auth().currentUser.toString])
    )

    const LoadingPopup = ({visible})=>(
        <Modal visible={visible} transparent={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size='large' color='#0000ff' />
            </View>
        </Modal>
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
                    <LoadingPopup visible={LoadingModalVisible} />
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
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10,fontSize:18, marginBottom:5,color:'black'}} key={e+index}>{e.title}</Text>
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
    let data_use = data;

    const handleRatingGiven = (gid, debtorid, debtStatus) =>{
        // let temp = data_use
        // console.log(temp)
        if (debtStatus == "paid"){
            const group = data_use.findIndex((obj => obj.id == gid))
            // console.log(group)
            const debtor = data_use[group].data.findIndex((obj => obj.debtorid == debtorid))
            // console.log(debtor)
            data_use[group].data[debtor].ratedByUser = true
        }
    }

    return (
        <SafeAreaView style={{paddingBottom:80}}>
            {data_use.map((e, index) => {
                return (
                    <React.Fragment key={index}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, marginRight: 10, fontSize:18, marginBottom:5,color:'black'}} key={e+index}>{e.title}</Text>
                        { e.data && e.data.map((t,index) => {
                            return(
                                <ListComponent e={e} t={t} index={index} key={t+index} handleRatingGiven={handleRatingGiven}/>
                            )
                        })
                        }                        
                    </React.Fragment>
                )
            })}
        </SafeAreaView>
    )
}
const handleRating = async (rate, debtorid) => {
    await updateRating(debtorid, rate);
};
    
async function setDebtRating(detail,debtorid,debtorname,rate){
    for(item of detail){
        // console.log(item.eid,debtorid,item.priceToPay,debtorname,rate)
        await updateDebtRating(item.eid,debtorid,item.priceToPay,debtorname,rate)
    }
    alert("Give rating successful")
}
function ListComponent({e,t,index, handleRatingGiven}) {
    const navigation = useNavigation();
    const [rating, setRating] = useState(5);
    const [ratedByUser, setRatedByUser] = useState((t.ratedByUser? true:false))
    const currentUser = auth().currentUser
    const currname = currentUser?.displayName
    const uid = currentUser?.uid
    // console.log(t.ratedByUser, ratedByUser)
    return (
        <View style={{backgroundColor:'white',}}>
            {
                !(t.ratedByUser || ratedByUser)  &&
                <>
                <TouchableOpacity style={[Styles.box,{borderBottomColor:'white'}]} 
                    onPress={()=>{navigation.navigate('Detail',{detail: t.detail, DebtOrDebtor: "Debtor", DebtOrDebtorName:t.debtorName, DebtOrDebtorId:t.debtorid, group:{gid:t.gid,name:e.title},currUser:{uid:uid,name:currname}})}}
                >
                    <Text key={t.debtorName} style={Styles.debttext1}>{t.debtorName}</Text>
                    <Text key={t.debtStatus} style={Styles.debttext2}>{t.debtStatus}</Text>
                    <Text key={t.totolPrice} style={Styles.debttext3}>{t.totolPrice}</Text>
                    <Pressable 
                        disabled={t.slip? false:true}
                        style={t.slip? Styles.btnaddslip:[Styles.btnaddslip,{backgroundColor:'lightgray'}]}
                        onPress={() => {
                            navigation.navigate('Add Slip', {amount:t.totolPrice, timestamp:t.timestamp, slip:t.slip, data:{detail: t.detail, group:{gid:t.gid,name:e.title},to:{uid:uid,name:currname}, from:{uid:t.debtorid,name:t.debtorName}}})
                        }}
                    >
                        <Text style={Styles.text}>Check Slip</Text>
                    </Pressable>
                </TouchableOpacity>
                { (t.debtStatus === 'paid') &&
                    <View style={{flexDirection:'row'}}>
                    <Text style={{textAlign:'left',margin:10, width:'21%', color:'grey'}}>Please rate the debtor </Text>
                    
                    <AirbnbRating
                        ratingContainerStyle={{backgroundColor:'white', paddingBottom:10,}}
                        reviews={['Very Bad','Bad','Good','Very Good','Excellent']}
                        count={5}
                        defaultRating={5}
                        size={25}
                        reviewSize={14}
                        reviewColor='#F88C8C'
                        // showRating={true}
                        rating={rating}
                        onFinishRating={(rating) =>{
                            setRating(rating)
                        }}
                    />
                    <TouchableOpacity 
                        style={[Styles.btnrate, {margin:30}]}
                        onPress={async()=>{
                            // console.log(handleRatingGiven)
                            // handleRatingGiven(e.id, t.debtorid, t.debtStatus)
                            handleRating(rating, t.debtorid)
                            await setDebtRating(t.detail,t.debtorid,t.debtorName,rating)
                            handleRatingGiven(e.id, t.debtorid, t.debtStatus)
                            setRatedByUser(true);
                        }}
                    >
                        <Text style={Styles.text}> Confirm </Text>
                    </TouchableOpacity> 
                </View>}
                </>
            }
        </View>
    )
}