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
import { timecheck, datecheck, uploadSlipDebt, getSlip, updateDebtStatus} from '../../database/DBConnection';
import { imagePicker, uploadSlip } from '../../database/Storage'
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import SuccessAdd from '../components/SuccessAdd';
import { Tooltip } from 'react-native-elements';

export default function AddingSlip({ navigation, route }) {
    const {amount,timestamp, data, slipURL, status} = route.params;
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const [pickerRes, setPickerRes] = useState({uri:""});
    const [transRef, setTransRef] = useState("202303143qO8X3qczVArfqJ");
    const [apiRespose, setResponse] = useState("");
    const [slip, setSlip] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };

    async function checkSlip(){
        if(pickerRes.fileName != undefined){
            if(apiRespose && apiRespose.status == 'Success'){
                const uid = auth().currentUser.uid;
                
                const t_check = timecheck(timestamp, apiRespose.time)
                const d_check = datecheck(timestamp, apiRespose.date)
                if(t_check>=0 && d_check>=0){
                    if(apiRespose.amount == amount){
                        const uid = auth().currentUser.uid;
                        for(let item of data.detail){
                            await updateDebtStatus(item.eid,uid); // to be paid
                        }
                        setIsSuccess(true)
                        await _saveSlip(true)
                    } else{
                        await _saveSlip(false)
                        // alert("the amount in slip is not equal to the total amount of the expense price.") 
                    }
                } else {
                    await _saveSlip(false)
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
        // console.log(pickerRes.fileName,pickerRes.uri,pickerRes.type)
        const photoURL = await uploadSlip(pickerRes.fileName,pickerRes.uri,pickerRes.type, slipURL.slipURL)
        if(photoURL) {
            await uploadSlipDebt(data.to.uid,data.from.uid,data.group.gid,photoURL,verificationStatus);
            // alert("upload a slip successfully")
            setSlip(photoURL)
        } else console.log("upload error")
    }

    useEffect(()=>{
        async function callapi(transRef){
            const response = await getpaymentInfo(transRef);
            setResponse(response);
        }
        if(transRef){
            callapi(transRef);
        }
        if(slipURL){
            setPickerRes({uri:slipURL.slipURL})
            setSlip(slipURL.slipURL)
            setIsSuccess(slipURL.status)
        }
        // console.log(transRef)
    },[transRef,isSuccess])

    // const PoppuSlipVerificationSuccessful = (
    //     <View>

    //     </View>
    // )

    return(
        <ScrollView>
            <View style={Styles.container}>
                {/* <View style={[{flex:1}]} /> */}
                <TouchableOpacity onPress={chooseFile}>
                    {
                        pickerRes.uri ? 
                        <Image style = {Styles.image_picker_slip} source={{uri: pickerRes.uri}}></Image>
                        :
                        <View style={{ justifyContent:'center'}}>
                            <Text style={{fontWeight:'bold',padding:100}}>select a slip</Text>
                        </View>
                    }
                </TouchableOpacity>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView,{backgroundColor: 'white', marginTop:10, justifyContent:'center', alignItems:'center', paddingHorizontal:20}]}>
                        {
                            (slip ?
                            (isSuccess ? 
                            <View style={{flexDirection:'row', margin:10}}>
                                <Text style={{fontSize:40,color:'#2E8B57',fontWeight:'bold'}}>Verified✓</Text>
                            </View>
                            :
                            <View style={{flexDirection:'row', margin:10}}>
                                <Text style={{fontSize:30,color:'red',fontWeight:'bold'}}>Verification Fail</Text>
                                <Tooltip ModalComponent={Modal} popover={<Text>This might occur for the following reasons.{"\n\n"}  - The amount of price is not equal.{"\n"}  - The age of the slip is older than the time of the lastest expense creation.{"\n\n"}Suggestion: Please check your transaction or contact the creditor to change your debt status.</Text>} 
                                    containerStyle={{borderColor:"#F88C8C", borderWidth:1.5, backgroundColor:'#F6EFEF', margin:5, height:220,width:250, left:140}}>
                                    <Feather name="alert-circle"/>
                                </Tooltip>
                            </View>) : null )
                        }
                        <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Expense Information</Text>
                        <Text>Group: {data.group.name}</Text>
                        <Text>From: {data.from.name}</Text>
                        <Text>To: {data.to.name} </Text>
                        <Text> Amount: {amount} </Text>
                        <Pressable 
                            // key={e.routeName}
                            style={isSuccess? [Styles.btnslip, {marginBottom:10, backgroundColor:'#2E8B57'}]:[Styles.btnslip, {marginBottom:10}]}
                            onPress={ async ()=> {
                                await checkSlip();
                            }}
                            disabled={isSuccess}
                        >
                            <Text style={Styles.text}>{isSuccess? "Verified":"Confirm" }</Text>
                        </Pressable>
                        {/* <SuccessAdd /> */}
                    </View>
                </View>
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
  