import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState } from "react";
import { Button, 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
 } from "react-native";
import { get_access_key, getpaymentInfo } from "../../database/api";
import { datetimecheck, uploadSlipDebt, getSlip, updateDebtStatus, sendPaidDebtNoti,sendDebtClearNoti, checkAllowToleave} from '../../database/DBConnection';
import { imagePicker, uploadSlip } from '../../database/Storage'
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { Tooltip } from 'react-native-elements';
import LoadingModal from '../components/LoadingModal';

export default function AddingSlip({ navigation, route }) {
    const {amount,timestamp, data, slip, status} = route.params;
    const [pickerRes, setPickerRes] = useState({uri:""});
    const [transRef, setTransRef] = useState("");
    // "2023041958Wqa1Js1a8KtcZ"
    const [apiRespose, setResponse] = useState("");
    const [slipURL, setSlip] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel && !response.error){
            // console.log("Adding Slip",response)
            setPickerRes(response.assets[0])
        }
    };

    const handleButtonClick = async() => {
        setIsLoading(true);
        
        await checkSlip();

        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
    };

    async function sendNoti(){
        let expenses = [];
        for(let item of data.detail){
            console.log(item.eid,data.from.uid,item.priceToPay, data.from.name)
            await updateDebtStatus(item.eid,data.from.uid,item.priceToPay, data.from.name, "paid"); // to be paid
            expenses.push({eid:item.eid,ename:item.itemName,priceToPay:item.priceToPay})
        }
        await sendPaidDebtNoti(data.from,data.to,data.group.gid,data.group.name,expenses)

        // check the debt is clear?
        for(let uid of [data.from.uid,data.to.uid]){
            const check = await checkAllowToleave(uid,data.group.gid)
            if(check.creditor && check.debtor){
                await sendDebtClearNoti(uid,data.group.gid,data.group.name)
                if(uid==data.from.uid){
                    global.NotiSignal = true
                }
            }
        }
    }

    async function checkSlip(){
        if(pickerRes.fileName != undefined){
            const apiResponse = await callapi(transRef);
            if(apiResponse && apiResponse.status == 'Success'){
                
                // The date and Time (part of the data responses) from SCB sometimes is inaccurate for the transaction. So when sending the date and time to check for the validity of the slip, it would cause the slip invalid at the time. 
                const dt_check = datetimecheck(timestamp, apiResponse.date,apiResponse.time)
                // let dt_check = 1
                // console.log("dt_check",dt_check)
                if(dt_check>=0){
                    if(apiResponse.amount == amount){
                        await sendNoti();
                        await _saveSlip(true)
                        setIsSuccess(true)
                        alert("Verification Pass")
                    } else{
                        await _saveSlip(false)
                        alert("the amount in slip is not equal to the total amount of the expense price.") 
                    }
                } else {
                    await _saveSlip(false)
                    alert("This slip's timestamp is OLD-TIME than the slip creation's timestamp.")
                    // alert("This slip's timestamp is OLD-TIME than the slip creation's timestamp.\n\nIf you have paid for the debt, please contact the owner to change the debt status for you.")
                }
            } else{
                alert("Fail to validate the slip.")
                // show unsuccessmodal()
            }
        } else {
            alert("Cannot find a slip.")
        }
    }

    async function _saveSlip(verificationStatus){
        // console.log(pickerRes.fileName,pickerRes.uri,pickerRes.type, slipURL)
        const photoURL = await uploadSlip(pickerRes.fileName,pickerRes.uri,pickerRes.type, slipURL)
        if(photoURL) {
            await uploadSlipDebt(data.to.uid,data.from.uid,data.group.gid,photoURL,verificationStatus,pickerRes);
            // alert("upload a slip successfully")
            setSlip(photoURL)
        } else console.log("upload the same slip")
    }

    async function callapi(transactionRef){
        const response = await getpaymentInfo(transactionRef);
        setResponse(response);
        return response
    }

    useEffect(()=>{
        // console.log({amount,timestamp, data, slip, status})
        if(slip){
            setPickerRes(slip.pickerRes)
            setSlip(slip.slipURL)
            if(isSuccess){
                setIsSuccess(isSuccess)
            } else{
                setIsSuccess(slip.status)
            }

            if(slip.status){
                setTransRef(" ")
            }
        }
        // console.log(transRef)
    },[isSuccess])

    // const PoppuSlipVerificationSuccessful = (
    //     <View>

    //     </View>
    // )

    return(
        <ScrollView>
            <View style={Styles.container}>
                {/* <View style={[{flex:1}]} /> */}
                <TouchableOpacity onPress={chooseFile} style={[Styles.image_picker_sip_shadow,{backgroundColor:'white'}]}>
                    {
                        pickerRes.uri ? 
                        <Image style = {Styles.image_picker_slip} source={{uri: pickerRes.uri}}></Image>
                        :
                        <View style={{ justifyContent:'center'}}>
                            <Text style={{fontWeight:'bold',padding:100, color:'grey'}}>select a slip</Text>
                        </View>
                    }
                </TouchableOpacity>
                <View style={{borderBottomWidth: 1}}>
                    <TextInput
                    style={{color:'black'}}
                    value={transRef}
                    placeholder={"Insert a transaction reference"}
                    placeholderTextColor='grey'
                    onChangeText={(text) => setTransRef(text)}
                    autoCapitalize={"none"}
                    />
                </View>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView,{backgroundColor: 'white', marginTop:10, justifyContent:'center', alignItems:'center', paddingHorizontal:20}]}>
                        {
                            (slipURL ?
                            (isSuccess ? 
                            <View style={{flexDirection:'row', margin:10}}>
                                <Text style={{fontSize:40,color:'#2E8B57',fontWeight:'bold'}}>Verified✓</Text>
                            </View>
                            :<>
                            <View style={{flexDirection:'row', margin:10}}>
                                <Text style={{fontSize:30,color:'red',fontWeight:'bold'}}>Verification Fail</Text>
                                <Tooltip ModalComponent={Modal} popover={<Text style={{color:'grey', fontSize:10}}>This might occur for the following reasons.{"\n\n"}  - The amount of price is not equal.{"\n"}  - The age of the slip is older than the time of the lastest expense creation.{"\n\n"}Suggestion: Please check your transaction or contact the creditor to change your debt status.</Text>} 
                                    containerStyle={{borderColor:"#F88C8C", borderWidth:1.5, backgroundColor:'#F6EFEF', margin:5, height:150,width:200}}>
                                    <Feather name="alert-circle" style={{color:'grey'}}/>
                                </Tooltip>
                            </View>
                            <Text style={{fontSize:10,color:'red'}}>Please add a slip again and click confirm</Text></>
                            ) : null )
                        }
                        
                        <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Expense Information</Text>
                        <Text style={{color:'grey'}}>Group: {data.group.name}</Text>
                        <Text style={{color:'grey'}}>From: {data.from.name}</Text>
                        <Text style={{color:'grey'}}>To: {data.to.name} </Text>
                        <Text style={{color:'grey'}}> Amount: {amount} </Text>
                        <Pressable 
                            // key={e.routeName}
                            style={isSuccess? [Styles.btnslip, {marginBottom:10, backgroundColor:'#2E8B57'}]:[Styles.btnslip, {marginBottom:10}]}
                            onPress={handleButtonClick
                                // console.log(amount,timestamp, data, slip, status)
                                // await checkSlip();
                                // console.log(amount,timestamp, data, slip, status)
                            }
                            disabled={isSuccess}
                        >
                            <Text style={Styles.text}>{isSuccess? "Verified":"Confirm" }</Text>
                            
                            {/* <Text style={Styles.text}>{isSuccess? "Verified":"" }</Text> */}
                        </Pressable>
                    </View>
                </View>
                <LoadingModal visible={isLoading} />
            </View> 
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    
  });
  